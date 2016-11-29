import { lex } from '../../src/lexer';

import { expect } from "chai";


describe("lexer", () => {

	describe("#lex",() => {


		let testCases = {
			"\n": "newLine",
			"\r": "newLine",
			"\t": "indent",
			"'": "singleQuote",
			"\"": "doubleQuote",
			"{": "curlyOpen",
			"}": "curlyClose",
			"(": "braceOpen",
			"=": "equals",
			")": "braceClose",
			";": "semiColon",
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
			"]": "bracketClose",
			"word": "word",
			"'word'": "string",
			"...": "include",
			"//test": "comment",
			"    ": "space",
			" ": "space",
			"\n": "newLine",
			"\r": "newLine",
			"\t": "indent"
		};

		let keys = Object.keys(testCases);

		for(let i = 0; i < keys.length; i++){
			it(`should tokenize ${ keys[i] } to ${ testCases[keys[i]] }`,( ) => {
				expect(lex(keys[i])[0].type).to.deep.equal(testCases[keys[i]]);
			})
		}



		it("should create a comment until a newline is present",() => {

			let res = lex("// a comment begins \nword")

			expect(res[0].type).to.equal("comment");
			expect(res[1].type).to.equal("newLine");
			expect(res[2].type).to.equal("word");


		});

		it("should find space in a series of words",() => {

			let res = lex("word1 word2  word3");

			expect(res[0].type).to.equal("word");
			expect(res[1].type).to.equal("space");
			expect(res[2].type).to.equal("word");
			expect(res[3].type).to.equal("space");
			expect(res[4].type).to.equal("word");


		});


		it("should ignore other quotes when in a string",() => {

			let res = lex(`"beginning'string'"`);

			expect(res[0].type).to.equal("string");

		});


	});

});