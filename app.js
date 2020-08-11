require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const { urlencoded } = require('express')
const PORT = process.env.PORT || 3000
const routers = require('./routers')

app.use(cors())
app.use(express.json())
app.use(urlencoded({ extended: false }))
app.use(routers)

app.listen(PORT, () => console.log('I love u', PORT))