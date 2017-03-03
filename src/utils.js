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

	processObject(object,(key,value) => {
		if(process(key,value)){
			result[key] = value;
		}
	})

	return result;

}


export function mapObject(object,process,callback){
	let result = {};

	processObject(object,(key,value,done) => {
		process(key,value,(res) => {
			result[key] = res;
			done();
		});
	},(err) => {
		callback(result);
	});

	
}


export function processObject(object,process,callback){

	if(object == null){
		return callback(null,null);
	}

	let keys = Object.keys(object);



	let needed = keys.length;
	let done = 0;

	if(needed == 0){
		return callback(null,{});
	}

	let finalObject = {};

	let next = () => {

		process(keys[done],object[keys[done]],(err,newValue) => {
			if(err != null){
				return callback(err);
			} 

			finalObject[keys[done]] = newValue;

			done++;
			if(done == needed){
				callback(null,newValue);
			}else{
				next();
			}
		});

	}
	
	next();

}


export function formatList(list){

    let result = "";
    if(list.length > 2){
        let lastItem = list[list.length-1];

        list.pop();

        result = list.join(", ")+" or "+lastItem;
        
        return result;
    }

    if(list.length == 2){
        result = list[0]+" or "+list[1]
        return result;
    }

    if(list.length == 1){
        result = list[0];
        return result;
    }

}


export function processArray(array,process,callback){


	if(array.length == 0){
		return callback();
	}

	let needed = array.length;
	let done = 0;

	let finalArray = [];

	let next = () => {

		if(done == needed){
			return callback(null,finalArray);
		}

		process(array[done],(err,resultItem) => {
		

			if(err != null){
				callback(err);
			}else{
				finalArray.push(resultItem);		
				done++;
				next();
				
			}
		})

	}

	next();

}