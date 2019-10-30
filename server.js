require('dotenv').config()
const express = require('express')
const app  = express()
const bodyParser = require('body-parser')
const formData = require('express-form-data')
const PORT =  4000 
const cors = require('cors')
const mongoose  =require('mongoose')
const config =  require('./data.js')
const eventsRoute = require('./events.route')
const usersRoute = require('./users.route')
const pitchesRoute = require('./pitches.route')
const mealsRoute = require('./meals.route')

const passport = require("passport")

mongoose.Promise = global.Promise
mongoose.connect(config.DB, {useNewUrlParser: true , useFindAndModify: false, useUnifiedTopology: true, reconnectTries:30,reconnectInterval: 500}).then(
  () => {console.log('Databse is connected')},
  err => { console.log('Can not connect to the database' + err)}
)


app.use(cors())
app.use(bodyParser.urlencoded({extend: true}))
app.use(bodyParser.json())
app.use('./uploads', express.static('uploads'))


//pasport middleware
app.use(passport.initialize())

//Passport config
require("./config/passport")(passport)

//Routes
app.use('/events', eventsRoute)
app.use('/meals', mealsRoute)
app.use('/pitches',pitchesRoute)
app.use('/users', usersRoute)

app.use(formData.parse())

app.listen(PORT, function(){
  console.log('Server is running on Port:' ,PORT)
})