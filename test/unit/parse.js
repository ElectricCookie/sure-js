import { Parser } from '../../src/parse';

import { expect } from "chai";

describe("Parse", () => {


	describe("#splitBy",() => {

		it("should split a string by the defined character",() => {

			let parser = new Parser();

			let input = "foo=bar,test=true";

			let result = parser.splitBy(",",input);


			expect(result).to.eql(["foo=bar","test=true"])
		

		});

		it("should ignore the splitting character if in a string",() => {

			let parser = new Parser();

			let input = "foo='bar,,',test=true";

			let result = parser.splitBy(",",input);


			expect(result).to.eql(["foo='bar,,'","test=true"])



		});

		it("should throw an exception if the string is unterminated",() => {

			let parser = new Parser();

			let input = "foo='bar,,,test=true";

			expect(parser.splitBy.bind(parser,",",input)).to.throw(/unfinishedString/)

		});

	})



	describe("#parse",() => {


		it("should throw an error if no type is found",() => {


			let input = `

				#Fail{
					
				}

			`
			let parser = new Parser();

			expect(parser.parse.bind(parser,input)).to.throw(/convertType/);

		});


		it("should throw an error if there's an unknown type",() => {


			let input = `

				#Fail{
					gibberish(){

					}
				}

			`
			let parser = new Parser();

			expect(parser.parse.bind(parser,input)).to.throw(/findType/);

		});


		it("should throw an error if there's an unclosed bracket",() => {


			let input = `

				#Fail{
					obj(){


				}

			`
			let parser = new Parser();

			expect(parser.parse.bind(parser,input)).to.throw(/unfinishedBlock/);

		});


		it("should return an empty object if no schema is defined",() => {
			let parser = new Parser();
			expect(parser.parse("")).to.eql({});

		});


		it("should throw an error if there's an unclosed schema",() => {


			let input = `

				#Fail{
					
			`
			let parser = new Parser();

			expect(parser.parse.bind(parser,input)).to.throw(/splitSchemas/);

		});




		it("should be able to parse a complex schema",() => {

			let input = `
			#Person{
				object(){
					id: str(length=36,parser=" 'foo' ")

					title: str(minLength=3,maxLength=4)

					description: str(minLength=4,maxLength=10)

					child: @Hobby

					children: arr(){
						@Hobby
					}

				}
			}

			#Hobby{
				object(){
					id: str(length=36)

					name: @Test

					title: str(minLength=3,maxLength=4)

					description: str(minLength=4,maxLength=10)
				}
			}

			#Test{
				str(minLength=3)
			}

			`

			let parser = new Parser();



			let result = parser.parse(input);





			expect(result).to.eql({
				"Person": {
					"type": "object",
					"params": {},
					"children": {
						"id": {
							"type": "string",
							"params": {
								"length": 36,
								"parser": " 'foo' "
							}
						},
						"title": {
							"type": "string",
							"params": {
								"minLength": 3,
								"maxLength": 4
							}
						},
						"description": {
							"type": "string",
							"params": {
								"minLength": 4,
								"maxLength": 10
							}
						},
						"child": {
							"type": "schema",
							"name": "Hobby"
						},
						"children": {
							"type": "array",
							"params": {},
							"child": {
								"type": "schema",
								"name": "Hobby"
							}
						}
					}
				},
				"Hobby": {
					"type": "object",
					"params": {},
					"children": {
						"id": {
							"type": "string",
							"params": {
								"length": 36
							}
						},
						"name": {
							"type": "schema",
							"name": "Test"
						},
						"title": {
							"type": "string",
							"params": {
								"minLength": 3,
								"maxLength": 4
							}
						},
						"description": {
							"type": "string",
							"params": {
								"minLength": 4,
								"maxLength": 10
							}
						}
					}
				},
				"Test": {
					"type": "string",
					"params": {
						"minLength": 3
					}
				}
			})

		});


		

	});


});