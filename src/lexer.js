
export function lex(source){

	let tokens = [];



	let types = {
		"\n": "newLine",
		"\r": "newLine",
		"\t": "indent",
		"?": "questionMark",
		"'": "singleQuote",
		"\"": "doubleQuote",
		"{": "curlyOpen",
		"}": "curlyClose",
		"(": "braceOpen",
		"=": "equals",
		")": "braceClose",
		";": "newLine",
		":": "colon",
		".": "dot",
		"\\": "backwardSlash",
		"/": "forwardSlash",
		"#": "hashtag",
		",": "comma",
		"@": "atSign",
		">": "gT",
		"<": "lT",
		"[": "bracketOpen",
		"]": "bracketClose"
	}


	let line = 1;
	let linePos = 1;

	let currentWord = null;
	let wordLine = 0;
	let wordPos = 0;
	let wordLinePos = 0;


	for(var i = 0; i < source.length; i++){

		let letter = source[i];

		if(letter == "\n"){
			line++;
			linePos = 0;
		}


		let type = types[letter];

		if(type == null){
		

			if(currentWord == null){

				wordLine = line;
				wordLinePos = linePos;
				wordPos = i;
				currentWord = ""

			}

			currentWord += letter;



		}else{

			if(currentWord != null){

				tokens.push({
					type: "word",
					value: currentWord,
					line: wordLine,
					linePos: wordLinePos,
					totalPos: wordPos
				});

				currentWord = null;

			}

			tokens.push({
				type,
				value: letter,
				line,
				linePos,
				totalPos: i
			})

		}

		

		linePos++;


	}


	if(currentWord != null){

		tokens.push({
			type: "word",
			value: currentWord,
			line: wordLine,
			linePos: wordLinePos,
			totalPos: wordPos
		});

		currentWord = null;

	}

	// Convert and reduce tokens


	
	tokens = findWhitespace(tokens);
	tokens = findComments(tokens);
    tokens = findNumbers(tokens);
    tokens = findStrings(tokens);
    tokens = findBooleans(tokens);
    tokens = findInclude(tokens);

	return tokens;

}


function findInclude(tokens){
	let result = [];
	let inInclude = false;

	let currentInclude = []
	for(let i = 0; i < tokens.length; i++){

		let token = tokens[i];

		if(token.type == "dot"){
			currentInclude.push(token);
		}else{
			if(currentInclude.length == 3){
				currentInclude[0].type = "include";
				currentInclude[0].value = "...";



				result.push(currentInclude[0]);
				result.push(token);
				currentInclude = [];

			}else if(currentInclude.length == 0){
				result.push(token)
			}else{
				result = result.concat(currentInclude);
				result.push(token);
				currentInclude = [];
			}
		}
	}

	if(currentInclude.length == 3){

		currentInclude[0].type = "include";
		currentInclude[0].value = "...";
		result.push(currentInclude[0]);
	}else{
		result = result.concat(currentInclude);
	}

	return result;
}


function findStrings(tokens){
    let result = [];

    let inString = false;
    let quoteType = null;
    let currentString = [];

    let stringLine;
    let stringLinePos;
    let stringTotalPos;

    for(let i = 0; i < tokens.length;i++){

        let token = tokens[i];



        if(inString){

            if(token.type == quoteType){

                // End of string
                currentString.shift()
            
                currentString[0].value = currentString.map((item) => { return item.value }).join("")

                currentString[0].type = "string";

                result.push(currentString[0])

                inString = false;
                quoteType = null;
                currentString = [];


            }else{
                // Add to string
                currentString.push(token)
            }

        }else{

            if(token.type == "singleQuote" || token.type == "doubleQuote"){
                // New String
                currentString.push(token);

                inString = true;
                quoteType = token.type;


            }else{
                result.push(token);
            }
        }


    }

    if(inString){
    	result = result.concat(currentString);
    }


    return result;


}

function findNumbers(tokens){

    let result = [];


    for(let i = 0; i < tokens.length; i++){
        let token = tokens[i];
        if(token.type == "word"){
            if(!isNaN(parseFloat(token.value))){
                token.type = "number";
                token.value = parseFloat(token.value);
            }
        }

        result.push(token);
    }


    return result;

}

function findBooleans(tokens){

    let result = [];


    for(let i = 0; i < tokens.length; i++){

        let token = tokens[i];

        if(token.type == "word"){
            if(token.value.toLowerCase() == "true"){
                token.type = "boolean";
                token.value = true;
            }else if(token.value.toLowerCase() == "false"){
                token.type = "boolean";
                token.value = false;
            }
        }

        result.push(token);

    }


    return result;

}

function findComments(tokens){
    let result = [];

    let currentComment = [];

    for(let i = 0; i < tokens.length;i++){
        let token = tokens[i];


        if(currentComment.length == 0 || currentComment.length == 1){
        	
        	if(token.type == "forwardSlash"){
        		currentComment.push(token);
        	}else{
        		result = result.concat(currentComment);
        		result.push(token);
        		currentComment = [];
        	}

        }else{
        	if(token.type == "newLine"){
        		let value = "";
        		for(let i = 0; i < currentComment.length; i++){
        			value += currentComment[i].value;
        		}
        		currentComment[0].type = "comment";
        		currentComment[0].value = value;
        		result.push(currentComment[0]);
        		result.push(token);
        		currentComment = [];
        	}else{
        		currentComment.push(token);
        	}
        }

    }

    if(currentComment.length == 1){

    	result = result.concat(currentComment);

    }else if(currentComment.length != 0){
    	let value = "";
		for(let i = 0; i < currentComment.length; i++){
			value += currentComment[i].value;
		}
		currentComment[0].type = "comment";
		currentComment[0].value = value;
		result.push(currentComment[0]);
    }

    return result;
}

function isWhiteSpace(letter){
	return letter == " ";
}

function findWhitespace(tokens){

	let result = [];

	for(let i = 0; i  < tokens.length; i++){

		let token = tokens[i];



		if(token.type == "word"){

			// Iterate over the word


			let currentString = "";
			let begin = token.linePos;
			let currentlyWhiteSpace = isWhiteSpace(token.value.charAt(0));

			for(let j = 0; j < token.value.length; j++){

				let letter = token.value[j];

				let isChar = isWhiteSpace(letter);

				let a = (currentlyWhiteSpace != isWhiteSpace(letter)) && currentString.length != 0

				let b = j == token.value.length-1

				if(a || b){

					result.push({
						type: currentlyWhiteSpace ? "space" : "word",
						value: j == token.value.length-1 ? currentString+letter : currentString,
						line: token.line,
						linePos: begin
					})

					begin = token.linePos+j;
					currentString = letter;
					currentlyWhiteSpace = isWhiteSpace(letter);


				}else{
					currentString += letter;
					currentlyWhiteSpace = isWhiteSpace(letter);
				}


			}
			


		}else{

			result.push(token)

		}
	}



	return result;
}

