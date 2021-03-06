User{
	
	#User{

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
		username: >User.User.username
		password: str(minLength=3,maxLength=1024)
	}

	#Register{
		
		username: >User.username
		password: >Login.password
		passwordConfirm: >Login.password
	}

	#PublicProfile{
		// Partial schema
		...User.User{
			username,
			bio,
			lastSeen,
			registered
		}
	}

}
