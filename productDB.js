// This file carry data from json to mongo database
require("dotenv").config()
const mongoose = require('mongoose')
const Productjson = require('./products.json')
const connectDB = require('./db/connect')
const Product = require('./models/products')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    await Product.deleteMany()  // it delete previous data, when you use 'node productDB' so that duplicate data is not entered in mongo database
    await  Product.create(Productjson) 
    console.log('data successfully send to server')
  } catch (error) {
    console.log(error)
  }
}

start()