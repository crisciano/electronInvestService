'use strict'

const express = require('express')
const FiisRoutes = require('./routes/FiisRoutes')
const MagicFormulaRoutes = require('./routes/MagicFormulaRoutes')
const AuthRouter = require('./routes/AuthRouter')
const UserRouter = require('./routes/UserRouter')
const path = require('path')
const cors = require('cors')

var app = express()

app.set('view engine', 'ejs')

app.use(cors())
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/v1/getFiis', FiisRoutes)
app.use('/v1/magicFormula', MagicFormulaRoutes)
app.use('/v1/api/auth', AuthRouter);
app.use('/v1/api/user', UserRouter )

module.exports = app
