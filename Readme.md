<p align="center"><img src="https://raw.githubusercontent.com/ElectricCookie/sure-js/master/assets/logo.png" width="30"/></p>

<h1 align="center">SureJS</h1>


<p align="center">
	<img src="https://travis-ci.org/ElectricCookie/sure-js.svg?branch=master" />
</p>

## IMPORTANT: Currently in Development - not ready for public use

Sure-JS is a Schema language that allows you to create Schemas which you can use in JavaScript, TypeScript and Java. Its Syntax allows for type checking, validation and schema composition. 



## Example
```
User{
	
	#Account{

		username: str(minLength=3,maxLength=16,trim=true)

		email: str(minLength=4,maxLength=64,trim=true)


		// Will be hashed
		password: str(length=64) 

		// Timestamps
		registered: number(allowDecimals=false)
		lastSeen: number(allowDecimals=false)

		bio: str(maxLength=2048)


	}

	#Login{
		username: >Account.username
		password: str(minLength=3,maxLength=1024)
	}

	#Register{
		// Include rules from schema by using @ Syntax
		username: >Account.username
		password: >Login.password
		passwordConfirm: >Login.password
	}

	#PublicProfile{
		// Partial schema
		>User.User{
			// Only the rules listed here are part of the schema
			username,
			bio,
			lastSeen,
			registed
		}
	}

}



```	


## Further reading

[Getting started](https://github.com/ElectricCookie/sure-js/wiki/Getting-started)

[Syntax Explaination](https://github.com/ElectricCookie/sure-js/wiki/Syntax)

[Custom Validators](https://github.com/ElectricCookie/sure-js/wiki/Custom-validators)





