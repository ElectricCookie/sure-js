import chalk from "chalk";
import { parse } from "./parse";
import { lex } from "./lexer";

import isObject from "lodash.isobject";
import isNumber from "lodash.isnumber";
import isBoolean from "lodash.isboolean";
import isString from "lodash.isstring";


import { mapObject, filterObject, processObject, iterateObject, processArray } from "./utils";


import string from "./validators/string";
import number from "./validators/number";


class SureJS{

	constructor(){
		this.namespaces = {};
		this.validators = [string,number];
	}

	registerValidator(validator){
		this.validators.push(validator);
	}


	getNamespaces(){
		return Object.keys(this.namespaces);
	}	


	getSchema(namespaceName,schemaName,filter,callback){


		if(this.namespaces[namespaceName] == null){
			return callback("unknownNamespace");
		}

		if(this.namespaces[namespaceName][schemaName] == null){
			return callback("unknownSchema");
		}

		let finalRules = {};
		let schema = this.namespaces[namespaceName][schemaName];

		processArray(schema.includes,(include,done) => {
			this.getSchema(include.namespace,include.schema,include.include,(err,rules) => {
				iterateObject(rules,(property,rule) => {
					finalRules[property] = rule;
				});
				done(err);
			});

		},(err) => {
			if(err != null){
				return callback(err);
			}

			processObject(schema.rules,(key,value,done) => {
				if(value.type == "itemLink"){

					this.getSchema(value.parameters.namespace,value.parameters.schema,null,(err,schema) => {

						if(schema[value.parameters.item] != null){
						
							finalRules[key] = schema[value.parameters.item];
							done(null);	
						
						}else{
						
							done("itemLinkIsNull");
						
						}

					});

				}else{

					finalRules[key] = value;

					done();	
				}

				

			},(err) => {


				if(filter != null && filter.length != 0){
			
					// Only include values that are present in the filter array.
					finalRules =  filterObject(finalRules,(key,value) => {
						return filter.indexOf(key) != -1
					});
				}

				callback(null,finalRules);

			});
		})


	}


	typesMatch(item,type,allowNull=false){
		if(item == null && allowNull){
			return true;
		}
		switch(type){

			case "string":
				return isString(item);
			case "number":
				return isNumber(item);
			case "boolean":
				return isBoolean(item);
			case "array":
				return Array.isArray(item);
			case "object":
				return isObject(item);
		}
		return false;
	}


	validate(namespaceName,schemaName,item,callback,allowNull = false){
		
		
		this.getSchema(namespaceName,schemaName,null,(err,rules) => {
			if(err != null){
				return callback(err);
			}

			let finalResult = {};
			
			processObject(rules,(key,value,processedRule) => {
			
				if(value.type == "link"){

					if(value.array){

						let resultArray = [];
						processArray(item[key],(arrayItem,done) => {

							this.validate(value.parameters.namespace,value.parameters.schema,arrayItem,(err,result) => {
								if(err != null){
									done(err)
								}else{
									resultArray.push(result);
									done();
								}
							});
						},(err) => {

							if(err != null){
								processedRule(err)							
							}else{
								finalResult[key] = resultArray;
								processedRule();
							}

						});


					}else{

						if(this.typesMatch(item[key],"object",value.nullable || allowNull)){
							this.validate(value.parameters.namespace,value.parameters.schema,item[key],(err,result) => {

								if(err != null){
									processedRule(err)
								}else{
									finalResult[key] = result;
									processedRule();
								}
							});	
						}else{
							processedRule({ 
								error: "invalidType",
								namespace: namespaceName,
								schema: schemaName,
								key,
								expected: value.type,
								got: item[key]
							})
						}
					}
				}else{

					if(value.array){
						let resultArray = [];
						processArray(item[key],(arrayItem,done) => {

							if(this.typesMatch(arrayItem,value.type,value.nullable || allowNull)){

								this.validateItem(arrayItem,value.parameters,value.type,item,(err,result) => {
									if(err != null){
										done({
											err,
											namespace: namespaceName, 
											schema: schemaName, key,
											item: arrayItem
										})
									}else{
										resultArray.push(result);
										done();
									}
								})

							}else{
								done({
									error: "invalidType",
									namespace: namespaceName,
									schema: schemaName,
									key: key,
									expected: value.type,
									got: arrayItem
								})
							}

						},(err) => {

							if(err != null){
								processedRule(err)							
							}else{
								finalResult[key] = resultArray;
								processedRule()
							}

						})

					}else{
						if(this.typesMatch(item[key],value.type,value.nullable || allowNull)){

							this.validateItem(item[key],value.parameters,value.type,item,(err,result) => {
								if(err != null){
									processedRule({
										err,
										namespace: namespaceName, 
										schema: schemaName, key
									})
								}else{
									finalResult[key] = result;
									processedRule();
								}
							})

						}else{
							processedRule({ 
								error: "invalidType",
								namespace: namespaceName,
								schema: schemaName,
								key,
								expected: value.type,
								got: item[key]
							})
						}

					}

					

				}

			},(err) => {
				if(err != null){
					callback(err,null);	
				}else{
					callback(null,finalResult);
				}
				

			});


		});

		
	}

	validateItem(item,parameters,type,object,callback){

		if(item == null){
			type = type+"Null";
		}


		processObject(parameters,(parameter,value,processedParameter) => {
			processArray(this.validators,(validator,processedValidator) => {

				if(validator[parameter] != null && validator[parameter].itemTypes.indexOf(type) != -1){

					validator[parameter].validate(item,value,(err,result) => {

						if(err != null){
							processedValidator(err);
						}else{
							item = result;
							processedValidator();
						}

					},{ store: this, parameters: parameters });
				}else{
					processedValidator();

				}

			},(err) => {
				processedParameter(err)
			})

		},(err) => {
			if(err != null){
				callback(err,null);
			}else{
				callback(null,item);
			}
		});

	}



	parseSchema(schema,meta){

			
		let tree = parse(lex(schema));


		iterateObject(tree.namespaces,(namespaceName,namespace) => {


			iterateObject(namespace.schemas,(schemaName,schema) => {


				// Check if this schema is already registered
				if(this.namespaces[namespaceName] != null && this.namespaces[namespaceName][schemaName] != null){
					throw new Error(chalk.red(`Can not register schema ${ schemaName }  in namespace ${ namespaceName } twice `));
				}
				
				// Create a namespace if it doesn't exist
				if(this.namespaces[namespaceName] == null){
					this.namespaces[namespaceName] = {

					};
				}

				// Store the schema

				this.namespaces[namespaceName][schemaName] = schema;
				
			});

		});

	}


	registerValidator(validator){
		this.validators.push(validator);
	}


}



export default SureJS;