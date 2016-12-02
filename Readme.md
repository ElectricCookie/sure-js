<p align="center"><img src="https://raw.githubusercontent.com/ElectricCookie/sure-js/master/assets/logo.png" width="30"/></p>

<h1 align="center">SureJS</h1>


<p align="center">
	<img src="https://travis-ci.org/ElectricCookie/sure-js.svg?branch=master" />
</p>

## IMPORTANT: Currently in Development - not ready for public use

Sure-JS is a Schema language that allows you to create Schemas which you can use in JavaScript, TypeScript and Java. Its Syntax allows for type checking, validation and schema composition. 

## Installation

```bash
	npm i --save sure-js
```

SureJS also offers a bundled version in the `dist` directory. Current minified file-size is `~20KB`


## Example
```
// User is the namespace
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
	        // We can include the rule from the Account Schema
		username: >Account.username
		password: str(minLength=3,maxLength=1024)
	}

	#Register{
		username: >Account.username
		password: >Login.password
		passwordConfirm: >Login.password
	}
	#PublicProfile{
		// Partial schema
		...User.User{
			// Only the rules listed here are part of the schema. If there are no {}-braces, or if they're empty all rules are included
			username,
			bio,
			lastSeen,
			registed
		}
	}

}	



```	

## Why SureJS
SureJS is a way to declartively express the shape of your data and all the constraints you're giving it. The main difference to technologies like Google's Protobufs is the Syntax of SureJS which makes it really easy to grasp the language and it also speeds up development with features like composition and references. The ability to be ported to other languages makes it a great tool for modern APIs since they often interact with multiple clients all written in their own language.




## Further reading

[Getting started](https://github.com/ElectricCookie/sure-js/wiki/Getting-started)

[Syntax Explaination](https://github.com/ElectricCookie/sure-js/wiki/Syntax)

[Custom Validators](https://github.com/ElectricCookie/sure-js/wiki/Custom-validators)


## Contributing

Contributions are very welcome. You can run `gulp test/watch/coverage/build` to make your development easier. Please make sure that all tests are passing before making a PR.

## Roadmap
* Syntax Highlighting
* TypeScript Transpiler
* Java Transpiler
* SureJS Form generator (generate React-Forms based on a schema)


