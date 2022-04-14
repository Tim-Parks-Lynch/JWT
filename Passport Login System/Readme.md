13:42 out of 36:27  https://www.youtube.com/watch?v=-RCnNyD0L-s&list=PLZlA0Gpn_vH9yI1hwDVzWqu5sAfajcsBQ&index=1

ejs - templating library for node js. ejs syntax look it up.

### Install modules
npm i express ejs
npm i bcrypt



# Server.js file

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

//never do this next part
const users = [] // this should be in the database



app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false })) // gives us access to req.body for the forms data

app.get('/', (req, res) => {
  res.render('index.ejs', {name: 'Kyle'})
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', (req, res) => {

})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10) // 10 is default salt rounds
    users.push({ id: Date.now().toString(), name: req.body.name, email: req.body.email, password: hashedPassword})
  } catch {

  }
  req.body.email
})


app.listen(3000)

# views > index.ejs
<!-- <h1> Hi <%= name %></h1>  // ejs syntax, what ever the hell that is -->

# views > register.ejs
<h1>Register</h1>
<form action= '/register' method='POST'>
  <div>
    <label for='name'>Name</label>
    <input type='text' id='name' name='name' required>
  </div>
    <div>
    <label for='email'>Email</label>
    <input type='text' id='email' name='email' required>
  </div>
    <div>
    <label for='password'>Password</label>
    <input type='text' id='password' name='password' required>
  </div>
  <button type='submit'> Register</button>
</form>
<a href='/login'>Login </a>


# views > login.ejs
<h1>Login</h1>
<form action= '/login' method='POST'>
  <div>
    <label for='email'>Email</label>
    <input type='text' id='email' name='email' required>
  </div>
    <div>
    <label for='password'>Password</label>
    <input type='text' id='password' name='password' required>
  </div>
  <button type='submit'> Login</button>
</form>
<a href='/register'>Register</a>


