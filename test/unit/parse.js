import { parse } from '../../src/parse';
import { lex } from '../../src/lexer';
import { expect } from "chai";

describe("Parse", () => {
	

	describe("#parse",() => {
		it("should create a valid tree",() => {

			let tokens = lex(`

				Namespace{

					#Schema1{
						value: str[](test=true,bar=3,example="string")
					}


					#Schema2{
						...Schema1
					}

					#Schema3{
						...Schema3{
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
			
			expect(tree.namespaces.Namespace.schemas.Schema1.rules).to.have.property("value");
			expect(tree.namespaces.Namespace.schemas.Schema1.rules.value).to.to.deep.equal({
				parameters: {
					test: true,
					bar: 3,
					example: "string"
				},
				array: true,
				type: "string"
			});

			expect(tree.namespaces.Namespace.schemas.Schema1.includes).to.deep.equal([]);
			expect(tree.namespaces.Namespace.schemas.Schema2.includes).to.deep.equal([{ namespace: "Namespace", schema: "Schema1", include: [] }]);
			expect(tree.namespaces.Namespace2.schemas.Schema5.includes).to.deep.equal([{ namespace: "Namespace", schema: "Schema1", include: ["foo"] }]);

		});
		

	});

});