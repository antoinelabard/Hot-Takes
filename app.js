const express = require('express')
require('dotenv').config()
const app = express()
let authRoutes = require('./routes/auth')
let sauceRoutes = require('./routes/sauce')
let helmet = require('helmet')
const rateLimit = require('express-rate-limit')
let mongoSanitize = require('express-mongo-sanitize')
const path = require('path')

const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connection to Mongoose successful'))
  .catch(() => console.log('Connection to Mongoose failed'))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Vous avez atteint le nombre de requête maximum, merci de réessayer dans un instant."
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})
app.use(express.json())
app.use(helmet())
app.use(mongoSanitize())
app.use('/api/auth', apiLimiter, authRoutes)
app.use('/api/sauces', sauceRoutes)
app.use('/images', (_, res, next) => {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
})
console.log(">>>>>>>>>>>>>>>>>>>>>>>>" + __dirname)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
