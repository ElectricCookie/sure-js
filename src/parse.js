import * as _ from "lodash";

import chalk from "chalk";

const defaultIgnores = ["comment","newLine","space","indent"];


/*

    findNamespaceBegin 
        word -->
            findNamespaceOpen 
                curlyOpen -->
                    findSchemaBeginOrNamespaceClose
                        hashtag
                            findSchemaName
                                word -->
                                    findSchemaOpen
                                        curlyOpen -->
                                            findItemNameOrSchemaClose
                                                word -->
                                                    findItemSeperator
                                                        colon -->
                                                            findTypeName
                                                                word -->
                                                                    findParameterStartOrTypeEnd
                                                                        braceOpen -->
                                                                            findParameterNameOrParameterEnd
                                                                                word -->
                                                                                    findParameterSeperator
                                                                                        equals -->
                                                                                            findParameterValue
                                                                            <------------------ word,number,boolean 

                                                                                braceClose -->
                                                                                    findTypeEnd -->
                                            <------------------------------------------- newline
                                            <--------------------------- newLine
                        <---------------------- culyClose
        <-------------- curlyClose



        */












        export function parse(tokens){


            let result = {};

            let currentNamespace = null;    
            let currentSchema = null;
            let currentItemName = null;
            let currentParameterName = null;





            const modes = {

                "findNamespaceBegin": {
                    expect: {
                        word: (token) => {

                            currentNamespace = token.value;

                            result[token.value] = {
                                schemas: {

                                }
                            };

                            return "findNamespaceOpen";
                        }
                    },
                    ignore: defaultIgnores
                },

                "findNamespaceOpen": {
                    expect: {
                        curlyOpen: (token) => {

                            return "findSchemaBeginOrNamespaceClose";
                        }
                    },
                    ignore: defaultIgnores
                },

                "findSchemaBeginOrNamespaceClose": {
                    expect: {
                        hashtag: (token) => {

                            return "findSchemaName";
                        },
                        curlyClose: (token) => {

                            return "findNamespaceBegin";
                        }
                    },
                    ignore: defaultIgnores
                },
                "findSchemaName": {
                    expect: {
                        word: (token) => {
                            currentSchema = token.value;
                            result[currentNamespace].schemas[token.value] = {
                                rules: {

                                },
                                includes: []
                            }

                            return "findSchemaOpen";
                        }
                    },
                    ignore: defaultIgnores
                },

                "findSchemaOpen": {
                    expect: {
                        curlyOpen: (token) => {
                            return "findItemNameOrSchemaCloseOrInclude";
                        }
                    },
                    ignore: defaultIgnores
                },

                "findItemNameOrSchemaCloseOrInclude": {
                    expect: {

                        word: (token) => {
                            currentItemName = token.value
                            result[currentNamespace].schemas[currentSchema].rules[token.value] = {
                                type: null,
                                parameters: {}
                            };

                            return "findItemSeperator";
                        },

                        curlyClose: (token) => {
                            return "findSchemaBeginOrNamespaceClose";
                        },
                        include: (token) => {

                            return "findSchemaLinkBegin";
                        }

                    },
                    ignore: defaultIgnores
                },

                "findSchemaLinkBegin": {
                    expect: {
                        atSign: (token) => {
                            return "findSchemaLinkName";
                        }
                    },
                    ignore: defaultIgnores
                },

                "findSchemaLinkName": {
                    expect: {
                        word: (token) => {

                            result[currentNamespace].schemas[currentSchema].includes.push(token.value);

                            return "findIncludeEnd";
                        }
                    },
                    ignore: ["comment","indent","space"]
                },


                "findIncludeEnd": {

                    expect: {
                        newLine: (token) => {
                            return "findItemNameOrSchemaCloseOrInclude";
                        }
                    },
                    
                    ignore: ["space","indent","space"]
                },

                "findItemSeperator": {
                    expect: {
                        colon: (token)  => {
                            return "findTypeName";
                        }
                    },
                    ignore: defaultIgnores
                },
                "findTypeName": {
                    expect: {
                        word: (token) => {

                            result[currentNamespace].schemas[currentSchema].rules[currentItemName].type = token.value;

                            return "findParameterStartOrTypeEnd";
                        }
                    },
                    ignore: defaultIgnores
                },
                "findParameterStartOrTypeEnd": {
                    expect: {
                        braceOpen: (token) => {
                            return "findParameterNameOrParameterEnd";  
                        },
                        newLine: (token) => {
                            return "findItemNameOrSchemaCloseOrInclude";
                        }
                    },
                    ignore: ["comment","indent","space"]
                },
                "findParameterNameOrParameterEnd": {
                    expect: {
                        word: (token) => {

                            currentParameterName = token.value;

                            return "findParameterSeperator";
                        },
                        braceClose: (token) => {
                            return "findTypeEnd"; 
                        }
                    },
                    ignore: defaultIgnores
                },

                "findNextParameterOrParameterEnd": {
                    expect: {
                        braceClose: (token) => {
                            return "findTypeEnd";
                        },
                        comma: (token) => {
                            return "findParameterNameOrParameterEnd";
                        }
                    },
                    ignore: defaultIgnores
                },

                "findParameterSeperator": {
                    expect: {
                        equals: (token) => {
                            return "findParameterValue"  
                        }
                    },
                    ignore: defaultIgnores
                },
                "findParameterValue": {
                    expect: {
                        string: (token) => {

                            result[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters[currentParameterName] = token.value;

                            return "findNextParameterOrParameterEnd";
                        },
                        number: (token) => {

                            result[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters[currentParameterName] = token.value;

                            return "findNextParameterOrParameterEnd";
                        },
                        boolean: (token) => {

                            result[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters[currentParameterName] = token.value;

                            return "findNextParameterOrParameterEnd";
                        }
                    },
                    ignore: defaultIgnores
                },
                "findTypeEnd": {
                    expect: {
                        semiColon: (token) => {
                            return "findItemNameOrSchemaCloseOrInclude";
                        },
                        newLine: (token) => {
                            return "findItemNameOrSchemaCloseOrInclude";
                        }
                    },
                    ignore: ["comment","indent","space"]
                }

            };



            let currentMode = "findNamespaceBegin";


            for(let i = 0; i < tokens.length; i++){

                let token = tokens[i];

                if(modes[currentMode] != null){
                    let mode = modes[currentMode];

                    // Check if current token is expected

                    if(mode.expect[token.type] != null){
                        currentMode = mode.expect[token.type](token);

                    }else{
                        // Check if current token may be ignored
                        if(mode.ignore.indexOf(token.type) == -1){

                            throw new Error(
                                chalk.red(
                                    "Syntax Error: Expected "+
                                    formatList(Object.keys(mode.expect))+
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