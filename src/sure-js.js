import chalk from "chalk";
import { parse } from "./parse";
import { lex } from "./lexer";
import * as fs from "fs";

import SureJS from "./sure-js-browser"

import glob from "glob";
import { mapObject, filterObject, processObject, iterateObject, processArray } from "./utils";


import string from "./validators/string";
import number from "./validators/number";


class SureJsStore extends SureJS{

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
}



export default SureJsStore;