require('dotenv').config()
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(express.json())

// store posts and users in a database, not in an array like here
// moved to server.js only
// const posts = [
//   {
//     username: 'Kyle',
//     title: 'Post 1'
//   },
//   {
//     username: 'Jim',
//     title: 'Post 2'
//   }
// ]

const users = []

// Moved to server.js only
// app.get('/posts', authenticateToken, (req, res) => {
//   // thanks to authenticateToken we get access to user
//   console.log(req.user)
//   res.json(posts.filter(post => post.username === req.user.name))
// })

// app.get('/login', (req, res) => {

// })

// do not do this in production, store in a databse
// he says tokens should be stored in a database or a rediscache, not how we implement it here
let refreshTokens = []

app.post('/token', async (req, res) => {
	const refreshToken = req.body.token
	if (refreshToken === null) return res.sendStatus(401)
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403) // if current refresh tokens include the one sent to us
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403)
		const accessToken = generateAccessToken({ name: user.name })
		res.json({ accessToken: accessToken })
	})
})

// delete these from the database not from refreshTokens above, as that shouldn't be used
app.delete('/logout', (req, res) => {
	refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
	console.log('refresh token removed', refreshTokens)
	res.sendStatus(204)
})

app.get('/users', async (req, res) => {
	res.json(users)
})

// create a new user, need to change the path
// salts and hashes the password
app.post('/users', async (req, res) => {
	try {
		// const salt = await bcrypt.genSalt() // could also do like we did below and just add the number 10 as the second arg to bcrypt.hash
		const hashedPassword = await bcrypt.hash(req.body.password, 10) // 2nd arg was originally salt our variable commented out above
		const user = { name: req.body.name, password: hashedPassword } // the salt is actually stored in the database
		users.push(user) // in reality we would store this in the database
		res.status(201).send('created user')
	} catch (e) {
		res.status(500).send()
	}
})

// Login a user if the password is correct
app.post('/users/login', async (req, res) => {
	// find the user (use your database not the users object created above)
	const user = users.find((user) => user.name === req.body.name)
	if (user === null) {
		return res.status(400).send('Cannot find user')
	}
	try {
		//bcrypt.compare takes care of timing attacks for us
		if (await bcrypt.compare(req.body.password, user.password)) {
			// will compare the sent password, with the stored password from the user
			const username = user.name // the name found in the database, not the one passed to req.body
			const foundUser = { name: username }
			// res.json({foundUser: foundUser})
			//serialize the user, create and sign the jwt
			// const accessToken = jwt.sign(foundUser, process.env.ACCESS_TOKEN_SECRET) changed it to
			const accessToken = generateAccessToken(foundUser)
			const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET) // no timer for refresh token. We manually handle it
			refreshTokens.push(refreshToken)
			res.json({ accessToken: accessToken, refreshToken: refreshToken })
		} else {
			res.send('Not Allowed')
		}
	} catch {
		res.status(500).send()
	}
})

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' })
}

// Moved to server.js
//Authentication MiddleWare, put this in it's own file and import

// function authenticateToken(req, res, next) {
//   // Bearer TOKEN Authorization
//   const authHeader = req.headers['authorization']
//   // console.log('auth header right here man', authHeader)
//   // if auth header exists and Bearer Token exists
//   const token = authHeader && authHeader.split(' ')[1] //Bearer Token; token part is [1] on the split
//   if(token === null) return res.sendStatus(401) //no token found

//   //verify the token
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, foundUser) => {
//     if(err) return res.sendStatus(403) // token is found, but not valid, they don't have access/authorization
//     req.user = foundUser
//     next()
//   })
// }

console.log('4000 auth')
app.listen(4000)
