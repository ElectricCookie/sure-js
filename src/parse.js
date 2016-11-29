import * as _ from "lodash";

import chalk from "chalk";

const defaultIgnores = ["comment","newLine","space","indent"];



function formatList(list){

    let result = "";
    if(list.length > 2){
        result += list.slice(0,list.length-2).join(", ")
        result += " or "+list[list.length-1];    
    }

    if(list.length == 2){
        result = list[0]+" or "+list[1]
    }

    if(list.length == 1){
        result = list[0];
    }


    return result;

}



function iterateObject(object,process){

    let keys = Object.keys(object);

    for(let i = 0; i < keys.length;i++){

        let key = keys[i];
        let value = object[key];
        process(key,value);
    }

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
                "findExcludedValues": ["curlyOpen"],
                "findSchemaOpen": ["newLine"]
            },
            ignore: ["comment","space","indent"]
        },
        "findExcludedValues": {
            expect: {
                "findSchemaOpen": ["curlyClose"],
                "findExcludedValues": ["word","comma"]
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
                "findItemLink": ["word","dot"],
                "findArrayStart": ["braceOpen"],
                "findSchemaOpen": ["newLine"]
            }
        },
        "findArrayStart": {
            expect: {
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
                "findSchemaOpen": ["braceClose"]
            }
        }
    };


    let currentNamespace;
    let currentSchema;
    let currentItemName;
    let currentParameter;

    let currentInclude = [];
    let currentExcludedValues = [];

    let currentLink = [];

    let currentItemLink = [];

    let isArray = false;

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
                        exclude: currentExcludedValues
                    });

                    currentInclude = [];
                    currentExcludedValues = [];
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
                if(currentLink.length == 3){
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

                isArray = false;

                result.namespaces[currentNamespace].schemas[currentSchema].rules[token.value] = {
                    parameters: {},
                    type: null,
                    array: false
                }
            }
        },

        findItemType: {
            word: (token) => {
                
                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].type = token.value;

            },
            bracketClose: (token) => {
                if(isArray){
                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].array = true;
                        
                }
                

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
                console.log("Include",token.value);
                currentInclude.push(token.value);
            },

        },
        findExcludedValues: {
            word: (token) => {
                currentExcludedValues.push(token.value);
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

                    //console.log(currentMode,token.value);  

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

            
        }else{
            throw new Error(chalk.red("Invalid Mode: "+currentMode)+" this is an internal Error!");
        }

    }

    return result;
}


