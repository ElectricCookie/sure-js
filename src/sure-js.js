import chalk from "chalk";
import { parse } from "./parse";
import { lex } from "./lexer";
import * as fs from "fs";
import glob from "glob";

function iterateObject(object,process){

	let keys = Object.keys(object);

	for(let i = 0; i < keys.length;i++){

		let key = keys[i];
		let value = object[key];
		process(key,value);
	}

}




class SureJsStore{

	constructor(){


		this.namespaces = {};


	}


	getNamespaces(){
		return Object.keys(this.namespaces);
	}



	validate(schemaName,item,callback){

	}




	parseSchema(schema,meta){

		console.log(this);
		
		let tree = parse(lex(schema));

		console.log(tree);

		iterateObject(tree.namespaces,(namespaceName,namespace) => {

			console.log(namespace)

			iterateObject(namespace.schemas,(schemaName,schema) => {


				// Check if this schema is already registered
				if(this.namespaces[namespaceName] != null && this.namespaces[namespaceName][schemaName] != null){
					throw new Error(chalk.red(`Can not register schema ${ schemaName }  in namespace ${ namespaceName } twice `));
				}
				
				// Create a namespace if it doesn't exist
				if(this.namespaces[namespaceName] == null){
					this.namespaces[namespaceName] = {};
				}
				
			});

		});

	}

	addSchemas(expr,callback){
		
		glob(expr,{},(err,files) => {

			if(err){ throw err; }

			console.log(files);

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