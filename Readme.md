# <img src="https://raw.githubusercontent.com/ElectricCookie/sure-js/master/assets/logo.png" width="30"/> Sure-JS [![Build Status](https://travis-ci.org/ElectricCookie/sure-js.svg?branch=master)](https://travis-ci.org/ElectricCookie/sure-js) 

## IMPORTANT: Currently in Development - not ready for public use

Sure-JS is a Schema language that allows you to create Schemas which you can use in JavaScript, TypeScript and Java. Its Syntax allows for type checking, validation and schema composition. 



## Example
```


People{

	#Person{
		id: str(length=36)

		title: str(minLength=3,maxLength=4)

<<<<<<< HEAD
		description: str(minLength=4,maxLength=10)
=======
		description: @General.Description
>>>>>>> origin/master

		
		hobbies: arr(){
			str(length=36)
		}
	}




	#Hobby{
		id: str(length=36)

		title: str(minLength=3,maxLength=4)

		description: @General.Description


	}
	
	#PersonPopulated{
		...@Person
		hobbies: arr(){
			@Hobby
		}
	}

<<<<<<< HEAD


}


General{
	
	#Description: str(minLength=4,maxLength=10)

}


=======


}


General{
	
	#Description: str(minLength=4,maxLength=10)

}


>>>>>>> origin/master




```	

## Syntax explaination

### Namespaces
Schemas always belong to a namespace. A namespace is declared as follows: 
``` 
Namespace{
	
}
``` 

### Types
A type describes a data-type with it's validation attributes. 
```
	type(attribute1="foo",attribute2=10)
```

Default types are: 
* `str()  string()`
* `nr() number()` 
* `bool()  boolean()` 
* ` arr() array() `
* `map()`  




### Schemas 
<<<<<<< HEAD
Schemas are defined using the `#` symbol.
=======
Schemas are defined using the `#` symbol. A schema may consist of multiple types or a single type.
>>>>>>> origin/master
Example:
```
Namespace{
	// Multiple types
	#Schema1{
		name: str()
		age: nr()
	}

<<<<<<< HEAD
	
=======
	// Single type
	#Schema2 = str()
>>>>>>> origin/master
}
```

### Schema References
You can link to a different Schema by using the `@` symbol.

Example:
```
Namespace{
	#Book{
<<<<<<< HEAD
		author: @Schema2
=======
		author: @Author
>>>>>>> origin/master
	}

	#Author{
		name: str()
		age: nr()
	}
}
``` 

### Composition
You can include rules from another schema in the current one using the `...@Schema` Syntax. A value that is included from another schema can also be overwritten by simply defining it again.


Example:
```
Namespace{
	#Book{
		id: str(length=36)
		title: str()
		released: nr()
	}

	#Comic{
		...@Book
		colored: bool()
		title: str(maxLength=36)
	}

}

```  

<<<<<<< HEAD

## Language compatibility

Sure-JS is designed to work across many languages. There are integrations planned for TypeScript, Java and Go. To make sure your validation is working across all languages you can annotate which ones are required by using this syntax:

```

Validations{
	str{
		"minLength": ["go","js","ts"]
	}
	
}

```
It is the task of the language implementation to make sure these declarations are matched. The Sure-JS JS library supports these checks by default.

=======
>>>>>>> origin/master


