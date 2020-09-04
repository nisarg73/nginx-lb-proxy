'use strict'

const express = require('express')

const HOST = '0.0.0.0'
const PORT = '3110'

const app = express()

app.get('/', (req, res) => {
  console.log('Hit!')
  res.send('Hello, World!')
})

app.listen(PORT, HOST, () => {
  console.log(`Listening to http://${HOST}:${PORT}`)
})
