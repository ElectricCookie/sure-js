module.exports = `
	Namespace{
		#Schema1{
			// comment () + FOo bar 	test
			name: str(length=3,trim=true)
		}

		#Schema2{
			// foobar
			age: str[](
				length=3,
				trim=false
			) // test

			owner: @Schema1

		}

		#Schema3{
			...Schema2{ age }
			excalibur: boolean()	
			randomNumber: >Schema2.age
			otherNumber: >randomNumber
		}
	}
`; 
