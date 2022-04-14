# Installation

- npm i jsonwebtoken
- npm i dotenv
- npm i bcrypt

create .env file

# Creating a secure password

We need to salt and then hash a password to make it secure. We do this with bcrypt. Salting adds random characters to the password, this way if one persons password gets cracked, other peoples won't because the hashed password will be different for each user, because the salt is different for each user.

We just need to make sure we store the salt along with the password. Bcrypt takes care of all of this for us.

# Generating PsuedoRandom String for JWT TOKEN Secret

You can use the crypto module inside of node.js in order to generate a pseudo random key for your JWT Token Secret and your Refresh Token Secret by using the randomBytes method
example:

- In new terminal

* type 'node' and hit enter
* type: require('crypto').randomBytes(64).toString('hex')
* The output will be a randomish generated string.

Documentation:

- Crypto Module in Node.js
  https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/#:~:text=The%20crypto%20module%20is%20a,such%20as%20TLS%20and%20https.

- RandomBytes
  https://nodejs.org/api/crypto.html#cryptorandombytessize-callback

# Requiring .env config file

At the top of your main server file (server.js for us) before all the other requires

require('dotenv').config()

# Getting posts based on JWT Signed in User

Refer to server.js - authenticationToken function middleware and the requests.rest file in order to piece together how to send the get request with the authorization header. It will need Authorization Bearer 'yourtokenbutnotasastring'

# Testing on two different servers

Create a start2 script in your package.json and point it to server2.js. Copy over server.js to a new file named server2.js. Start server1 and server 2. Inside the requests.rest files create a user and get their token, then send the get localhost:3000/posts to 4000/posts and confirm that you can use the same token from the other server. This is because the JWT is hosted on the client, not the server like session based cookies.

# Refresh Tokens

Refresh tokens are needed to renew your authentication tokens. Right now tokens have no expiration date, and if a token is stolen a hacker could use it indefinetly. That is where refresh tokens come in. You are supposed to save the refresh token in a safe spot (he doesn't say where), and then you give your access tokens a really short expiration date, so if someone gets access to your access token they only have access to your account for a few mins before access is revoked. Then the user must use the refresh token to get a new access token. In order to stop that from happening to the refresh token, you invalidate a refresh token, by creating a logout route that deletes a refresh token so that the user can't use it to refresh their access token. In effect, it deletes it from the list of valid refresh tokens. The main reason you create a refresh token is so that you can invalidate users who have stolen access that shouldn't have access.

The second reason you do this is so you can take authentication off of your other server, effectively splitting up what each one does. One is for auth, the other is for other things, this is great for micro architectures.
