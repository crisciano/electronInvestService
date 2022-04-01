'use strict'

const express = require('express')
const FiisRoutes = require('./routes/FiisRoutes')
const MagicFormulaRoutes = require('./routes/MagicFormulaRoutes')
const AnalizeRoutes = require('./routes/AnalizeRoutes')
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
app.use('/v1/analize', AnalizeRoutes)

module.exports = app
