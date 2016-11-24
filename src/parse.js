import * as _ from "lodash";

import chalk from "chalk";

const defaultIgnores = ["comment","newLine","space","indent"];

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
                "findSchemaLink": ["atSign"]
            }
        },
        "findItemType": {
            expect: {
                "findParameterOpen": ["braceOpen"],
                "findSchemaOpen": ["newLine"],
                "findArrayStart": ["bracketOpen"]
            },
            ignore: ["comment","indent","space"]
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


    let currentNamespace = null;
    let currentSchema = null;

    let currentInclude = [];
    let currentExcludedValues = [];

    const listeners = {

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

        findIncludeName: {
            word: (token) => {

                if(currentInclude.length == 2){
                    throw new Error(`An include has to declare two values at maximum. Use Syntax: ...Namespace.Schema or ...Schema !`);
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

                    console.log(currentMode);  

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
                            " but got "+token.type+" instead at line "+token.line+":"+token.linePos
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
