import { parse } from '../../src/parse';
import { lex } from '../../src/lexer';
import { expect } from "chai";

describe("Parse", () => {
	

	describe("#parse",() => {
		it("should create a valid tree",() => {

			let tokens = lex(`

				Namespace{

					#Schema1{
						value: str[maxLength=10](test=true,bar=3,example="string")
					}


					#Schema2{
						...Schema1
					}

					#Schema3{
						...Schema1{
							value
						}

					}
				}

				Namespace2{
					#Schema4{
						...Namespace.Schema1
					}
					#Schema5{
						...Namespace.Schema1{ foo }
					}
				}

				Namespace3{

					#Schema6{
						value: nr(allowDecimals=true)
						test: @Namespace.Schema1[maxLength=3,minLength=3]
					}

					#Schema7{
						test: >Schema6.value
					}


					#Schema8{
						test: >Namespace.Schema1.value
					}
				}

			`);

			let tree = parse(tokens);


			expect(tree).to.have.property("namespaces");
			expect(tree.namespaces).to.have.property("Namespace");
			expect(tree.namespaces).to.have.property("Namespace2");
			expect(tree.namespaces).to.have.property("Namespace3");

			expect(tree.namespaces.Namespace).to.have.property("schemas");
			expect(tree.namespaces.Namespace.schemas).to.have.property("Schema1");
			expect(tree.namespaces.Namespace.schemas.Schema1).to.have.property("rules");

			expect(tree.namespaces.Namespace3.schemas.Schema7.rules.test).to.have.property("arrayParameters");
			
			expect(tree.namespaces.Namespace.schemas.Schema1.rules).to.have.property("value");
			expect(tree.namespaces.Namespace.schemas.Schema1.rules.value).to.to.deep.equal({
				parameters: {
					test: true,
					bar: 3,
					example: "string"
				},
				array: true,
				nullable: false,
				arrayParameters: {
					maxLength: 10
				},
				type: "string"
			});

			expect(tree.namespaces.Namespace.schemas.Schema1.includes).to.deep.equal([]);
			expect(tree.namespaces.Namespace.schemas.Schema2.includes).to.deep.equal([{ namespace: "Namespace", schema: "Schema1", include: [] }]);
			expect(tree.namespaces.Namespace2.schemas.Schema5.includes).to.deep.equal([{ namespace: "Namespace", schema: "Schema1", include: ["foo"] }]);

		});
	

		it("should throw a syntax error",() => {

			expect( ()=> {
				let tree = parse(lex(`Namespace{ {{{ syntaxError`));
			}).to.throw();

		});
	

		it("should throw an error when declaring a parameter twice",() => {

			expect( ()=> {
				let tree = parse(lex(`

					Namespace{
						#Schema1{
							foo: str(bar=13,bar=13)
						}
					}

				`))
			}).to.throw();

		});

		it("should throw an error when declaring a schema twice",() => {

			expect( ()=> {
				let tree = parse(lex(`

					Namespace{
						#Schema1{
							foo: str()
						}

						#Schema1{
							bar: str()
						}
					}

				`))
			}).to.throw();

		});


		it("should throw an error when declaring an incorrect link",() => {

			expect( ()=> {
				let tree = parse(lex(`

					Namespace{
						#Schema1{
							foo: str()
						}

						#Schema2{
							bar: @Namespace.Schema1.bar
						}
					}

				`))
			}).to.throw();

		});

		it("should throw an error when declaring an incorrect itemLink",() => {

			expect( ()=> {
				let tree = parse(lex(`

					Namespace{
						#Schema1{
							foo: str()
						}

						#Schema2{
							bar: >Namespace.Schema1.foo.bar
						}
					}

				`))
			}).to.throw();

		});

		it("should throw an error when declaring an incorrect include",() => {

			expect( ()=> {
				let tree = parse(lex(`

					Namespace{
						#Schema1{
							foo: str()
						}

						#Schema2{
							@Namespace.Schema1.foo{}
						}
					}

				`))
			}).to.throw();

		});


	});


	


});