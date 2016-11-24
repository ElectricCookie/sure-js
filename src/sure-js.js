import chalk from "chalk";
import { parse } from "./parse";


function iterateObject(object,process){

	let keys = Object.keys(object);

	for(let i = 0; i < keys.length;i++){

		let key = keys[i];
		let value = object[key];
		process(key,value);
	}

}




class SureJsStore{

	SureJsStore(){

		this.namespaces = {};

	}


	validate(schemaName,item,callback){

	}


	parseSchema(schema){
		let tree = parse(schema);


		iterateObject(tree,(namespaceName,namespace) => {

			iterateObject(namespace.schemas,(schemaName,schema) => {


				// Check if this schema is already registered
				if(this.namespaces[namespaceName] != null && this.namespaces[namespaceName][schemaName] != null){
					throw new Error(chalk.red(`Can not register schema ${ schemaName }  in namespace ${ namespaceName } twice `));
				}
				
				// Create a namespace if it doesn't exist
				if(this.namespaces[namespaceName] == null){
					this.namespaces[namespaceName] = {};
				}

				// Write the schema

				
				
			});

		});

	}

	addSchemas(directory,recursive=false){
		// Todo parse globs
	}

	registerValidator(validator){
		this.validators.push(validator);
	}




}



export default SureJsStore;