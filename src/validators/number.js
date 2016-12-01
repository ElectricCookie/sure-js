import * as _ from "lodash";

const number = {
	min: {
		parameterType: "number",
		itemTypes: ["number"],	
		validate: (item,value,callback,options) => {
			// options = { store, parameters }
			if(item < value){
				callback("tooSmall",null);
			}else{
				callback(null,item);
			}
		}
	},
	max: {
		parameterType: "number",
		itemTypes: ["number"],	
		validate: (item,value,callback,options) => {
			// options = { store, parameters }
			if(item > value){

				callback("tooBig",null);
			}else{
				callback(null,item);
			}
		}
	},
	allowDecimals: {
		parameterType: "boolean",
		itemTypes: ["number"],
		validate: (item,value,callback,options) => {
			if(item % 1 != 0 && !value){
				return callback("notWholeNumber",null);
			}else{
				callback(null,item);
			}
		}
	},
	round: {
		parameterType: "number",
		itemTypes: ["number"],
		validate: (item,value,callback,options) => {
			let precision = Math.pow(10,value);
			item = Math.round(item*precision)/precision;
			callback(null,item);
		}
	},
	floor: {
		parameterType: "number",
		itemTypes: ["number"],
		validate: (item,value,callback,options) => {
			let precision = Math.pow(10,value);
			item = Math.floor(item*precision)/precision;
			callback(null,item);
		}
	},
	ceil: {
		parameterType: "number",
		itemTypes: ["number"],
		validate: (item,value,callback,options) => {
			let precision = Math.pow(10,value);
			item = Math.ceil(item*precision)/precision;
			callback(null,item);
		}
	},
	
}


export default number;