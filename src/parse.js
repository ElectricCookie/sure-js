import * as _ from "lodash";


export class Parser {



    constructor() {
        this.types = [{
            identifiers: ["obj", "object"],
            children: "named",
            type: "object"
        }, {
            identifiers: ["str", "string"],
            children: "none",
            type: "string"
        }, {
            identifiers: ["nr", "number"],
            children: "none",
            type: "number"
        }, {
            identifiers: ["bool", "boolean"],
            children: "none",
            type: "boolean"
        }, {
            identifiers: ["arr", "array"],
            children: "single",
            type: "array"
        }];
    }


    parse(input) {
        let schemas = this.splitSchemas(input);
        let result = {};


        _.forEach(schemas, (value,key) => {
        	if(value != null){
        		result[key] = this.convert(value);	
        	}
        	
        });
        return result;
    }



    splitSchemas(source) {
        let res = {};

        if(source.trim().length == 0){
            return res;
        }

        let schemaNames = source.match(/#\w+(?={(.|\n)+})/g)
        if(schemaNames == null){
        	throw new Error(JSON.stringify({
        		errorCode: "parseError",
        		operation: "splitSchemas",
        		at: source
        	}));
        }
        schemaNames = schemaNames.map((item) => item.slice(1));

        let schemas = source.split(/#\w+/g);


        schemas.shift();

        schemas = schemas.map((item) =>  {
        	return this.getBody(item)
        });


       

        schemaNames.map((item,index) => {
        	res[item] = schemas[index];
        })

        return res;

    }

    convert(input) {

    	if(input.trim().charAt(0) == "@"){
    		return {
    			type: "schema",
    			name: input.trim().substr(1).replace(/\s/g,"")
    		}
    	}

        let type = this.convertType(input);
        let found = false;
        for (var i = this.types.length - 1; i >= 0; i--) {
            if (this.types[i].identifiers.indexOf(type) != -1) {
                type = this.types[i];
                found = true;
                break;
            }
        }


        if (!found) {
            throw new Error(JSON.stringify({
                errorCode: "parseError",
                operation: "findType",
                at: input
            }));
        } else {

            let result = {
            	type: type.type,
            	params: this.convertParams(input)
            };


            switch (type.children) {
                case "single":

                	result.child = this.convert(this.getBody(input,"{","}"));


                    break;

                case "named":

                    let body = this.getBody(input, "{", "}");

                    result.children =  this.splitByName(body);


                    break;
            }
            return result;

        }


    }


    splitByName(source) {


        let children = {};
        let inString = false;
        let stringChar;
        let currentId = "";
        let count = 0;
        let currentBody = "";

        let mode = "id";

        for (let i = 0; i < source.length; i++) {

            let char = source[i];


            if (char == ":") {
                mode = "body";
                continue;
            }

            if (mode == "id") {
                currentId += char;;
            } else {

                currentBody += char;

                if (inString) {
                    if (char == stringChar) {
                        inString = false;
                    }
                } else {

                	if(count == 0 && char == "\n"){
                		mode = "id";
                        children[currentId.replace(/(\n|\t|\s)+/g,"")] = currentBody;
                        currentId = "";
                        currentBody = "";

                	}else{


                		if (char == "\"" || char == "'") {
	                        inString = true;
	                        stringChar = char;
	                    } else {

	                        if (char == "{") {
	                            count++;
	                        } else if (char == "}") {
	                            count--;
	                            if (count == 0) {
	                                mode = "id";
	                                children[currentId.replace(/(\n|\t|\s)+/g,"")] = currentBody;
	                                currentId = "";
	                                currentBody = "";

	                            }
	                        }

	                    }

                	}

                    

                }


            }




        }


        let final = {};


        Object.keys(children).map((key) => {

        	final[key] = this.convert(children[key]);
        });


        return final;


    }



    convertType(input) {
        let match = input.match(/\w+(?=\()/);

        if (match == null || match.length != 1) {
            throw new Error(JSON.stringify({
                errorCode: "parseError",
                operation: "convertType",
                at: input
            }));
        } else {
            return match[0];
        }
    }


    convertParams(input) {

        let params = this.getBody(input, "(", ")");


        let pairs = this.splitBy(",", params);

        pairs = pairs.map((pair) => {

            return this.splitBy("=", pair);
        });

        let result = {};


      	pairs.map((item) => {

            let key=  item[0];
            let value = item[1];
            /*
            if(value.charAt(0) == "'" || value.charAt(0) == "\""){
                value = value.slice(1);
            }


            if(value.charAt(value.length-1) == "'" || value.charAt(value.length-1) == "\""){
                value = value.slice(0,value.length-2);
            } */       

      		result[item[0]] = JSON.parse(value) //this.isNumeric(value) ? parseFloat(value) : value;
      	});


        return result;


    }


    splitBy(split, source) {

        let result = [];
        let currentItem = "";
        let lastChar;
        let inString = false;
        let stringChar;
        for (let i = 0; i < source.length; i++) {

            let char = source[i];

            if (lastChar != "\\") {
                if (char == "\"" || char == "'") {
                    if (inString && stringChar == char) {
                        inString = false;
                    } else {
                        if (!inString) {
                            inString = true;
                            stringChar = char;
                        }
                    }
                }
            }

            if (char == split && !inString) {
                result.push(currentItem);
                currentItem = "";

            } else {
                currentItem += char;
            }

            lastChar = char;

        }
        if(currentItem.length != 0){
        	result.push(currentItem);	
        }
        

        if (inString) {
            throw new Error(JSON.stringify({
                errorCode: "parseError",
                operation: "split",
                details: "unfinishedString",
                at: source
            }))
        }


        return result;


    }


    getBody(source, start = "{", end = "}") {

        let count = 0;
        let result = "";
        let inString = false;
        let stringChar = null;
        let lastChar;
        for (let i = 0; i < source.length; i++) {

            if ((source[i] == "\"" || source[i] == "'") && lastChar != "\\") {
                if (inString && stringChar == source[i]) {
                    inString = false
                } else {
                    if (!inString) {
                        inString = true;
                        stringChar = source[i];
                    }
                }
            }

            if (source[i] == start && !inString && lastChar != "\\") {
                count++;
            }
            if (source[i] == end && !inString && lastChar != "\\") {
                count--;
                if (count == 0) {
                    return result.substr(1);
                }
            }

            if (count != 0) {
                result += source[i];
            }
            lastChar = source[i];
        }

        throw new Error(JSON.stringify({
            errorCode: "parseError",
            operation: "retrieveBody",
            details: "unfinishedBlock",
            at: source
        }));

    }

}