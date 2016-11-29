export function iterateObject(object,process){


	let keys = Object.keys(object);

	for(let i = 0; i < keys.length;i++){

		let key = keys[i];
		let value = object[key];
		process(key,value);
	}

}

export function filterObject(object,process){

	let result = {};

	iterateObject(object,(key,value) => {
		if(process(key,value)){
			result[key] = value;
		}
	})

	return result;

}


export function mapObject(object,process){
	let result = {};

	iterateObject(object,(key,value) => {
		result[key] = process(key,value);
	});

	return result;
}


export function processObject(object,process,callback){

	if(object == null){
		callback(null,null);
	}

	let keys = Object.keys(object);



	let needed = keys.length;
	let done = 0;

	if(needed == 0){
		return callback(null,{});
	}

	let next = () => {

		process(keys[done],object[keys[done]],(err) => {
			if(err != null){
				return callback(err);
			} 

			done++;
			if(done == needed){
				callback();
			}else{
				next();
			}
		});

	}
	
	next();

}




export function processArray(array,process,callback){


	if(array.length == 0){
		callback()
	}

	let needed = array.length;
	let done = 0;

	let next = () => {

		if(done == needed){
			return callback();
		}
		let called = false;

		process(array[done],(err) => {
			
			if(called){
				throw new Error("Calling callback twice. No op!")
			}
			called = true;


			if(err != null){
				callback(err);
			}else{
				
				done++;
				next();
				
			}
		})

	}

	next();

}