module.exports = `
Namespace{
		#Schema1{
			// comment () + FOo bar 	test
			name: str(length=3,trim=true)
		}

		#Schema2{
			// foobar
			age: str(
				length=3,
				trim=false
			) // test
		}

		#Schema3{
			...@Schema2
			excalibur: boolean()	
		}
	}
`; 
