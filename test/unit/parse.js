import { Parser } from '../../src/parse';

describe("Parse", () => {

	describe("#getBody",() => {

		it("should retrieve the body of bracket expression",() => {

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

						title: str(minLength=3,maxLength=4)

						description: str(minLength=4,maxLength=10)
					}
				}
			`

			let parser = new Parser();


			let result = parser.parse(input);
			console.log(JSON.stringify(result));
			
			
		
		});


		

	});


});