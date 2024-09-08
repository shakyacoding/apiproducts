require("dotenv").config()
const express = require('express')
const app = express()
const { getAllProducts, getAllProductsTesting } = require('./controllers/products')
const products_routes = require('./routes/products')
const connectDB = require('./db/connect')
const cors = require('cors');

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: 'https://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: ['Content-Type', 'Authorization'],
}));

app.get('/', (req,res) => {
  res.send("hi deepak")
})

// middleware or to set router
app.use("/api/products", products_routes)

const PORT = process.env.PORT || 5000;

const start = async() => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(PORT, () => {
     console.log( `${PORT} Yes i am connected` )
     
    })
  } catch (error) {
    console.log( error)
    
  }
}

start()