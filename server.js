require('dotenv').config()
const express = require('express')
const app = express()
// const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(express.json())

// store posts and users in a database, not in an array like here
const posts = [
	{
		username: 'Kyle',
		title: 'Post 1',
	},
	{
		username: 'Jim',
		title: 'Post 2',
	},
]

//Moved to authServer.js
// const users = []

app.get('/posts', authenticateToken, (req, res) => {
	// thanks to authenticateToken we get access to user
	console.log(req.user)
	res.json(posts.filter((post) => post.username === req.user.name))
})

//Moved to auth
// app.get('/users', async (req, res) => {
//   res.json(users)
// })

//Moved to auth
// app.post('/users', async (req, res) => {
//   try {
//     // const salt = await bcrypt.genSalt() // could also do like we did below and just add the number 10 as the second arg to bcrypt.hash
//     const hashedPassword = await bcrypt.hash(req.body.password, 10) // 2nd arg was originally salt our variable commented out above
//     const user = { name: req.body.name, password: hashedPassword } // the salt is actually stored in the database
//     users.push(user) // in reality we would store this in the database
//     res.status(201).send('created user')
//   }catch(e){
//     res.status(500).send()
//   }
// })

// app.get('/login', (req, res) => {
//   //Authenticate user

//   //Create token

// })

// This will be on authServer.js
// app.post('/users/login', async (req, res) => {
//   // find the user (use your database not the users object created above)
//   const user = users.find(user => user.name === req.body.name)
//   if(user === null){
//     return res.status(400).send('Cannot find user')
//   }
//   try{
//     //bcrypt.compare takes care of timing attacks for us
//     if(await bcrypt.compare(req.body.password, user.password)){ // will compare the sent password, with the stored password from the user
//       const username = user.name // the name found in the database, not the one passed to req.body
//       const foundUser = { name: username}
//       // res.json({foundUser: foundUser})
//       //serialize the user, create and sign the jwt
//       const accessToken = jwt.sign(foundUser, process.env.ACCESS_TOKEN_SECRET)
//       res.json({ accessToken: accessToken})

//     }else{
//       res.send('Not Allowed')
//     }
//   }catch{
//     res.status(500).send()
//   }
// })

//Authentication MiddleWare, put this in it's own file and import

function authenticateToken(req, res, next) {
	// Bearer TOKEN Authorization
	const authHeader = req.headers['authorization']
	// console.log('auth header right here man', authHeader)
	// if auth header exists and Bearer Token exists
	const token = authHeader && authHeader.split(' ')[1] //Bearer Token; token part is [1] on the split
	if (token === null) return res.sendStatus(401) //no token found

	//verify the token

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, foundUser) => {
		if (err) return res.sendStatus(403) // token is found, but not valid, they don't have access/authorization
		req.user = foundUser
		next()
	})
}

console.log('3000 server')
app.listen(3000)
