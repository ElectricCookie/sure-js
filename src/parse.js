

import chalk from "chalk";

const defaultIgnores = ["comment","newLine","space","indent"];


import { iterateObject , formatList } from "./utils";   


function getType(type){

    const aliases = {
        str: "string",
        nr: "number",
        b: "boolean"
    }

    if(aliases[type] != null){
        return aliases[type];
    }

    return type;

}


export function parse(tokens){


    let result = {
        namespaces: {}
    };

    const modes = {

        "findNamespaceBegin": {
            expect: {
                "findNamespaceOpen": ["word"]
            }
        },
        "findNamespaceOpen": {
            expect: {
                "findNamespaceContent": ["curlyOpen"]
            }
        },
        "findNamespaceContent": {
            expect: {
                "findSchemaBegin": ["hashtag"],
                "findNamespaceBegin": ["curlyClose"]
            }
        },
        "findSchemaBegin": {
            expect: {
                "findSchemaName": ["word"]
            }
        },
        "findSchemaName": {
            expect: {
                "findSchemaOpen": ["curlyOpen"]
            }
        },
        "findSchemaOpen": {
            expect: {
                "findIncludeName": ["include"],
                "findItemName": ["word"],
                "findNamespaceContent": ["curlyClose"]
            }
        },

        "findIncludeName": {
            expect: {
                "findIncludeName": ["word","dot"],
                "findIncludedValues": ["curlyOpen"],
                "findSchemaOpen": ["newLine"]
            },
            ignore: ["comment","space","indent"]
        },
        "findIncludedValues": {
            expect: {
                "findSchemaOpen": ["curlyClose"],
                "findIncludedValues": ["word","comma"]
            }
        },
        "findItemName": {
            expect: {
                "findItemSeperator": ["colon"],
            }
        },
        "findItemSeperator": {
            expect: {
                "findItemType": ["word"],
                "findItemLink": ["gT"],
                "findSchemaOpen": ["newLine"],
                "findSchemaLink": ["atSign"]
            },
            ignore: ["space","indent","comment"]
        },

        "findItemType": {
            expect: {
                "findParameterOpen": ["braceOpen"],
                "findSchemaOpen": ["newLine"],
                "findArrayStart": ["bracketOpen"]
            },
            ignore: ["comment","indent","space"]
        },
        "findItemLink":{
            expect: {
                "findItemLink": ["word"],
                "findItemLinkSeperator": ["dot"],
                "findArrayStart": ["braceOpen"],
                "findSchemaOpen": ["newLine"]
            }
        },

        "findItemLinkSeperator": {
            expect: {
                "findItemLink": ["word"]
            }
        },

        "findArrayStart": {
            expect: {
                "findItemType": ["bracketClose"],
                "findArrayParameterName": ["word"]
            }
        },
        "findArrayParameterName": {
            expect: {
                "findArrayParameterSeperator": ["equals"]
            }
        },
        "findArrayParameterSeperator": {
            expect: {
                "findArrayParameterValue": ["string","number","boolean"],
            }
        },
        "findArrayParameterValue": {
            expect: {
                "findArrayStart": ["comma"],
                "findItemType": ["bracketClose"]
            }
        },

        "findParameterOpen": {
            expect: {
                "findParameterName": ["word"],
                "findSchemaOpen": ["braceClose"]
            }
        },
        "findParameterName": {
            expect: {
                "findParameterSeperator": ["equals"]
            }
        },
        "findParameterSeperator": {
            expect: {
                "findParameterValue": ["boolean","number","string"]
            }
        },
        "findParameterValue": {
            expect: {
                "findParameterOpen": ["comma"],
                "findSchemaOpen": ["braceClose"]
            }
        },

        "findSchemaLink": {
            expect: {
                "findSchemaLink": ["dot","word"],
                "findSchemaLinkArrayStart": ["bracketOpen"],
                "findSchemaOpen": ["newLine"]
            },
            ignore: ["comment","indent","space"]
        },

        "findSchemaLinkArrayStart": {
            expect: {
                "findSchemaOpen": ["bracketClose"],
                "findItemLinkArrayParameterName ": ["word"],
            }
        },
        "findItemLinkArrayParameterName ": {
            expect: {
                "findItemLinkArrayParameterSeperator": ["equals"],
            }
        },
        "findItemLinkArrayParameterSeperator": {
            expect: {
                "findItemLinkArrayParameterValue": ["boolean","number","string"]
            }
        },
        "findItemLinkArrayParameterValue": {
            expect: {
                "findSchemaLinkArrayStart": ["comma"],
                "findSchemaOpen": ["bracketClose"]
            }
        }
    };


    let currentNamespace;
    let currentSchema;
    let currentItemName;
    let currentParameter;

    let currentInclude = [];
    let currentIncludedValues = [];


    let currentLink = [];

    let currentItemLink = [];

    let isArray = false;
    let currentArrayParameter;

    const listeners = {


        findSchemaLink: {

            word: (token) => {
                if(currentLink.length == 2){
                    throw new Error(`A link has to declare two values at max. Use Syntax: @Namespace.Schema or @Schema !`)
                }


                currentLink.push(token.value);

            }

        },

        findArrayStart: {
            bracketOpen: (token) => {
                if(isArray){
                    throw new Error(`Can not declare value as array twice.`)
                }
                isArray = true;
            }
        },

        findNamespaceOpen: {

            

            word: (token) => {
                currentNamespace = token.value;
                if(result.namespaces[token.value] != null){
                    throw new Error(`Unable to declare namespace ${ token.value }. It is already defined!`)
                }
                result.namespaces[token.value] = {
                    schemas: {

                    }
                }
            }
        },

        findSchemaOpen: {
            any: (token) => {
                if(currentInclude.length != 0){
                    result.namespaces[currentNamespace].schemas[currentSchema].includes.push({
                        namespace: currentInclude.length == 2 ? currentInclude[0] : currentNamespace,
                        schema: currentInclude.length == 2 ? currentInclude[1] : currentInclude[0],
                        include: currentIncludedValues
                    });

                    currentInclude = [];
                    currentIncludedValues = [];
                }


                if(currentLink.length != 0){

                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].type = "link";
                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters = {
                        namespace: currentLink.length == 2 ? currentLink[0]: currentNamespace,
                        schema: currentLink.length == 2 ? currentLink[1] : currentLink[0]
                    }
                    
                    currentLink = [];
                }

                if(currentItemLink.length != 0){

                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].type = "itemLink";

                    if(currentItemLink.length == 1){
                        currentItemLink.unshift(currentSchema);
                    }

                    if(currentItemLink.length == 2){
                        currentItemLink.unshift(currentNamespace);
                    }

                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters = {
                        namespace: currentItemLink[0],
                        schema: currentItemLink[1],
                        item: currentItemLink[2]
                    }


                    currentItemLink = [];
                }

            }
        },

        findSchemaName: {

            word: (token) => {
                currentSchema = token.value;
                if(result.namespaces[currentNamespace].schemas[token.value] != null){
                    throw new Error(`Unable to declare schema ${ token.value }. It is already defined!`)
                }

                result.namespaces[currentNamespace].schemas[token.value] = {
                    rules: {},
                    includes: []
                }
            }
        },

        findItemLink: {
            word: (token) => {


                if(currentItemLink.length == 3){
                    throw new Error(`An item-link has to declare three values at max. Use Syntax: >Schema.item or ...Namespace.Schema.item !`)
                }
                currentItemLink.push(token.value);
            }
        },
        findItemName: {
            word: (token) => {
                
                if(result.namespaces[currentNamespace].schemas[currentSchema].rules[token.value] != null){
                    throw new Error(`Unable to declare schema ${ token.value }. It is already defined!`)
                }

                currentItemName= token.value;


                result.namespaces[currentNamespace].schemas[currentSchema].rules[token.value] = {
                    parameters: {},
                    type: null,
                    array: false,
                    arrayParameters: {}
                }
            }
        },

        findItemType: {
            word: (token) => {
                
                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].type = getType(token.value);

            },
            bracketClose: (token) => {
                if(isArray){
                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].array = true;

                    isArray = false;  
                    currentArrayParameter = null;

                }
                

            }
        },

        findItemLinkArrayParameterName: {

            word: (token) => {

                currentArrayParameter = token.value

            }

        },
        findItemLinkArrayParameterValue: {

            any: (token) => {

                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].arrayParameters[currentArrayParameter] = token.value;

            }

        },


        findArrayParameterName: {

            word: (token) => {

                currentArrayParameter = token.value

            }

        },
        findArrayParameterValue: {

            any: (token) => {

                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].arrayParameters[currentArrayParameter] = token.value;

            }

        },

        findParameterValue: {

            any: (token) => {
                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters[currentParameter] = token.value;   
            }

        },
        findParameterName: {
            word: (token) => {

                if(result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters[token.value] != null){

                    throw new Error(`Unable to declare parameter ${ token.value }. It is already defined!`)

                }

                currentParameter = token.value;



            }
        },
        findIncludeName: {
            word: (token) => {

                if(currentInclude.length == 2){
                    throw new Error(`An include has to declare two values at max. Use Syntax: ...Namespace.Schema or ...Schema !`);
                }
                currentInclude.push(token.value);
            },

        },
        findIncludedValues: {
            word: (token) => {
                currentIncludedValues.push(token.value.trim());
            }
        },
        findSchemaLinkArrayStart: {
            bracketOpen: (token) => {
                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].array = true;
            }
        }

    }


    let currentMode = "findNamespaceBegin";


    for(let i = 0; i < tokens.length; i++){

        let token = tokens[i];

        if(modes[currentMode] != null){

            let mode = modes[currentMode];

            let found = false;

            let options = mode.expect;

            let nextModes = Object.keys(options);

            for(let i = 0; i < nextModes.length; i++){

                let expectedTokens = options[nextModes[i]];

                if(expectedTokens.indexOf(token.type) != -1){
                    // Found the next mode


                    currentMode = nextModes[i];


                    if(listeners[currentMode] != null){
                        if(listeners[currentMode][token.type] != null) {
                            listeners[currentMode][token.type](token);    
                        }
                        
                        if(listeners[currentMode].any != null){
                            listeners[currentMode].any(token);
                        }
                    }

                    found = true;

                    break;
                }

            }

            if(!found){
                let ignore = defaultIgnores;
                if(modes[currentMode].ignore != null){
                    ignore = modes[currentMode].ignore;
                }

                if(ignore.indexOf(token.type) == -1){


                    let expected = [];

                    let modeKeys = Object.keys(modes[currentMode].expect);


                    for(let i = 0; i < modeKeys.length; i++){
                        expected = expected.concat(modes[currentMode].expect[modeKeys[i]]);
                    }


                    throw new Error(
                        chalk.red(
                            "Syntax Error: Expected "+
                            formatList(expected)+
                            " but got "+token.type+" instead. At line "+token.line+":"+token.linePos+" ("+currentMode+")"
                        )   
                    ) 
                }


            }

            
        }

    }

    return result;
}


