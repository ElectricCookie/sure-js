import chalk from "chalk";
import { parse } from "./parse";
import { lex } from "./lexer";
import * as fs from "fs";
import * as _ from "lodash"
import glob from "glob";
import { mapObject, filterObject, processObject, iterateObject, processArray } from "./utils";


import string from "./validators/string";
import number from "./validators/number";


class SureJsStore{

	constructor(){
		this.namespaces = {};
		this.validators = [string,number];
	}






	getNamespaces(){
		return Object.keys(this.namespaces);
	}


	getSchema(namespaceName,schemaName,filter){


		if(this.namespaces[namespaceName] == null){
			throw new Error(`Can not find namespace ${ namespaceName }`)
		}



		if(this.namespaces[namespaceName][schemaName] == null){
			throw new Error(`Can not find schema ${ schemaName } in  ${ namespaceName }`)	
		}

		let finalRules = {};
		let schema = this.namespaces[namespaceName][schemaName];


		

		
		// add rules of current schema
			
		for(let i = 0; i < schema.includes.length; i++){
			let include = schema.includes[i];

			let rules = this.getSchema(include.namespace,include.schema,include.include);


			iterateObject(rules,(property,rule) => {
				finalRules[property] = rule;
			});
			
		}

		
		// Add rules of current schema

		
		iterateObject(schema.rules,(key,value) => {


			if(value.type == "itemLink"){
				value = this.getSchema(value.parameters.namespace,value.parameters.schema)[value.parameters.item];
			}

			finalRules[key] = value;
		})	
			



		if(filter != null && filter.length != 0){
			
			// Only include values that are present in the filter array.
			return filterObject(finalRules,(key,value) => {
				return filter.indexOf(key) != -1
			});
		}

		

		return finalRules

	}


	typesMatch(item,type){

		switch(type){

			case "string":

				return _.isString(item);

			case "number":

				return _.isNumber(item);

			case "boolean":

				return _.isBoolean(item);

			case "array":

				return _.isArray(item);

			case "object":

				return _.isObject(item);

			default: 
				return false;

		}

	}


	validate(namespaceName,schemaName,item,callback){
		try{

			let rules = this.getSchema(namespaceName,schemaName);

			
			// Start iterating the rules

			// Check links

			let finalResult = {};

			processObject(rules,(key,value,processedRule) => {

				if(value.type == "link"){

					if(this.typesMatch(item[key],"object")){
						this.validate(value.parameters.namespace,value.parameters.schema,item[key],(err,result) => {

							if(err != null){
								processedRule(err)
							}else{
								finalResult[key] = result;
								processedRule();
							}
						});	
					}else{
						processedRule({ error: "invalidType", namespace: namespaceName, schema: schemaName, key })
					}
				}else{

					if(value.array){
						let resultArray = [];
						processArray(item[key],(arrayItem,done) => {

							if(this.typesMatch(arrayItem,value.type)){

								this.validateItem(arrayItem,value.parameters,value.type,item,(err,result) => {
									if(err != null){
										done({
											err,
											namespace: namespaceName, 
											schema: schemaName, key,
											item: arrayItem
										})
									}else{
										resultArray[key] = result;
										done();
									}
								})

							}else{
								done({ error: "invalidType", namespace: namespaceName, schema: schemaName, key })
							}

						},(err) => {

							if(err != null){
								processedRule(err)							
							}else{
								finalResult[key] = resultArray;
							}

						})

					}else{

						if(this.typesMatch(item[key],value.type)){



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
							processedRule({ error: "invalidType", namespace: namespaceName, schema: schemaName, key })
						}

					}

					

				}

			},(err) => {
				if(err != null){
					callback(err,null);	
				}else{
					callback(null,finalResult);
				}
				

			})



		}catch(e){
			throw e
			callback(e,null);
		}



	}

	validateItem(item,parameters,type,object,callback){



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

	addSchemas(expr,callback){
		
		glob(expr,{},(err,files) => {

			if(err){ throw err; }


			for(let i = 0; i < files.length; i++){
				let file = files[i];

				let data = fs.readFileSync(file);

				data = data.toString();

				this.parseSchema(data,{
					path: file
				});


			}

			callback();

		});
	}

	registerValidator(validator){
		this.validators.push(validator);
	}


}



export default SureJsStore;