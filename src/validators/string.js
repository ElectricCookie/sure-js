	
const string = {
	minLength: {
		parameterType: "number",
		itemTypes: ["string"],	
		validate: (item,value,callback,options) => {
			// options = { store, parameters }
			if(item.length < value){
				callback("tooShort",null);
			}else{
				callback(null,item);
			}
		}
	},
	maxLength: {
		parameterType: "number",
		itemTypes: ["string"],	
		validate: (item,value,callback,options) => {
			// options = { store, parameters }
			if(item.length > value){

				callback("tooLong",null);
			}else{
				callback(null,item);
			}
		}
	},
	trim: {
		parameterType: "boolean",
		itemTypes: ["string"],	
		validate: (item,value,callback,options) => {
			// options = { store, parameters }
			callback(null,value ? item.trim() : item)
		}
	}
}


export default string;