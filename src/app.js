'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const FiisRoutes = require('./routes/FiisRoutes')
const path = require('path')
const cors = require('cors')

var app = express()

app.set('view engine', 'ejs')

app.use(cors())
app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/v1/getFiis', FiisRoutes)

module.exports = app
