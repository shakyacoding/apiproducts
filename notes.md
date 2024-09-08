### API creation by thapa notes

- Open any folder and in terminal type these commands one by one
  -  npm init -y
  -  npm i express
  -  npm i nodemon

- Create new file using terminal by command
  - echo > app.js

- In 'package.json' file make changes in script
  ```js 
   "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }, 
  ```
### V-2 ( Setup server )
- In 'app.js' file
```js
const express = require('express')
const app = express()

const PORT = process.env.PORT || 5000;

app.get('/', (req,res) => {
  res.send("hi deepak")
})


const start = async() => {
  try {
    app.listen(PORT, () => {
     console.log( `${PORT} Yes i am connected` )
     
    })
  } catch (error) {
    console.log( error)
    
  }
}

start()
```
### V-3 (Setup Routes and Controllers)
- Make 2 folder
  - routes
  - controllers
- Inside both folder make file with same name 'products.js'
- IN folder 'routes' inside file 'products.js'
  
```js
  const express = require('express')
const router = express.Router()

const{
  getAllProducts,
  getAllProductsTesting,
} = require('../controllers/products')


router.route('/').get(getAllProducts)
router.route('/testing').get(getAllProductsTesting)

module.exports = router;
```
- IN folder 'controllers' inside file 'products.js'

```js
const getAllProducts = async(req,res) => {
  res.status(200).json({msg: 'I am getAllProducts'})
}

const getAllProductsTesting = async(req,res) => {
  res.status(200).json({msg: 'I am getAllProductsTesting'})
}

module.exports = {getAllProducts, getAllProductsTesting}
```
- In 'app.js' file
  
```js
const express = require('express')
const app = express()
const { getAllProducts, getAllProductsTesting } = require('./controllers/products')
const products_routes = require('./routes/products')


app.get('/', (req,res) => {
  res.send("hi deepak")
})

// middleware or to set router
app.use("/api/products", products_routes)

const PORT = process.env.PORT || 5000;

const start = async() => {
  try {
    app.listen(PORT, () => {
     console.log( `${PORT} Yes i am connected` )
     
    })
  } catch (error) {
    console.log( error)
    
  }
}

start()
```

## V-4
API testing with Postman

## V-5 ( Connection with MongoDB )
- Make folder 'db' and inside it create file 'connect.js'
  
- In terminal 
  -  npm i mongoose
  
- In 'connect.js' file
```js
const mongoose = require('mongoose')

uri = "mongodb+srv://babastore423:RUc0f93DbtZBZAfJ@cluster0.ocpv7.mongodb.net/"

const connectDB = () => {
  console.log('Connect db')
  return mongoose.connect(uri)
}

module.exports = connectDB
```

- In "app.js" file  
```js
const express = require('express')
const app = express()
const { getAllProducts, getAllProductsTesting } = require('./controllers/products')
const products_routes = require('./routes/products')
const connectDB = require('./db/connect')

app.get('/', (req,res) => {
  res.send("hi deepak")
})

// middleware or to set router
app.use("/api/products", products_routes)

const PORT = process.env.PORT || 5000;

const start = async() => {
  try {
    await connectDB()
    app.listen(PORT, () => {
     console.log( `${PORT} Yes i am connected` )
     
    })
  } catch (error) {
    console.log( error)
    
  }
}

start()
```
## V-6 ( Secure your Data with ENV )
- In terminal
  - npm i dotenv
  
- In 'app.js' file
  add this line at top
  - require("dotenv").config()
  
- Create file '.env' and inside it write
  - MONGODB_URL=mongodb+srv://babastore423:RUc0f93DbtZBZAfJ@cluster0.ocpv7.mongodb.net/
  
- In 'app.js' file , 2nd change is here
```js
const start = async() => {
  try {
    await connectDB(process.env.MONGODB_URL)
    app.listen(PORT, () => {
     console.log( `${PORT} Yes i am connected` )
     
    })
  } catch (error) {
    console.log( error)
    
  }
}

start()
```

- In 'connect.js' file 
```js
const mongoose = require('mongoose')

const connectDB = (uri) => {
  console.log("Connected to db" )
  
  return mongoose.connect(uri)
}

module.exports = connectDB;
```
### V-7 ( Creating Modals and Schema )

- Create Folder 'models' , inside it create a file 'product.js'
  
- In 'product.js' file
```js
const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required:[true, "price must be provided"]
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 4.9
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  company: {
    type: String,
    enum: {
      values: ['apple', 'samsung', 'dell', 'mi', 'nokia'],
      message: `${VALUE} is not supported`
    }
  }
})


module.exports = mongoose.model('Product', productSchema)
```

### V-8 ( Export data to database using json file )

- Create 2 file
  - 'product.json'
  - 'productDB.js' ( It carry data from json file to mongo database )

- Inside 'product.json' file
```json
[
  {
    "name":"iphone",
    "price":154,
    "feature":true,
    "company": "apple"
  },
  {
    "name":"watch",
    "price":10054,
    "feature":true,
    "company": "apple"
  },
  {
    "name":"Refrigerator",
    "price":20054,
    "company": "samsung"
  },
  {
    "name":"s20",
    "price":3054,
    "company": "nokia"
  }
]
```

- Inside 'productDB.js' file 
```js
// This file carry data from json to mongo database
require("dotenv").config()
const mongoose = require('mongoose')
const Productjson = require('./products.json')
const connectDB = require('./db/connect')
const Product = require('./models/products')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    await  Product.create(Productjson) 
    console.log('success')
  } catch (error) {
    console.log(error)
  }
}

start()
```

### V-9 ( Fetch all data from mongo database )

- Inside 'controller' folder, go inside file 'products.js'
  
- In file 'products.js'
```js
const Product = require('../models/products')

const getAllProducts = async(req,res) => {
  const mydata = await Product.find()
  res.status(200).json({mydata})
}

/* const getAllProductsTesting = async(req,res) => {
  res.status(200).json({msg: 'I am getAllProductsTesting'})
} */

module.exports = {getAllProducts, getAllProductsTesting}
```
### V-10 ( Add Filtration and Searching )

- To make search url dynamic, in go to 'controller' folder, inside it go to file 'products.js'

- In 'product.js'
```js
const Product = require('../models/products')

const getAllProducts = async(req,res) => {
  const mydata = await Product.find(req.query)
  res.status(200).json({mydata})
}

/* const getAllProductsTesting = async(req,res) => {
  res.status(200).json({msg: 'I am getAllProductsTesting'})
} */

module.exports = {getAllProducts, getAllProductsTesting}
```

### V-11 ( Filter property in API, make API work better )

- In 'productDB.js' file , add this code 
  - await Product.deleteMany()  // it delete previous data from mongo database, when you use 'node productDB' command in terminal,  so that duplicate data is not entered in mongo database

```js
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
```
- In 'controller' folder, in 'products.js' file
add this code 
 const {company} = req.query
  const queryObject = {}
  if (company){
    queryObject.company = company
  } 

  const mydata = await Product.find(queryObject)
```js
const Product = require('../models/products')

const getAllProducts = async(req,res) => {
  const {company} = req.query
  const queryObject = {}
  if (company){
    queryObject.company = company
  } 

  const mydata = await Product.find(queryObject)
  res.status(200).json({mydata})
}

/* const getAllProductsTesting = async(req,res) => {
  res.status(200).json({msg: 'I am getAllProductsTesting'})
} */

module.exports = {getAllProducts, getAllProductsTesting}
```

### V-12 ( Add Advance Search Functionality )

- In 'controller' folder, inside 'products.js' file
add this code 
if (name){
    queryObject.name = { $regex: name, $options: 'i'}
  } 
by using this code if there are 2 phone with name 'iphone' and 'iphone10' and when user type in url only 'iphone' then it will show both.( iphone and iphone10)

```js
const Product = require('../models/products')

const getAllProducts = async(req,res) => {
  const {company, name, price, featured, rating} = req.query
  const queryObject = {}
  if (company){
    queryObject.company = company
  } 
  if (name){
    queryObject.name = { $regex: name, $options: 'i'}
  } 
  if (price){
    queryObject.price = price
  } 
  if (featured){
    queryObject.featured = featured
  } 
  if (rating){
    queryObject.rating = rating
  } 

  const mydata = await Product.find(queryObject)
  res.status(200).json({mydata})
}

/* const getAllProductsTesting = async(req,res) => {
  res.status(200).json({msg: 'I am getAllProductsTesting'})
} */

module.exports = {getAllProducts, getAllProductsTesting}
```
### V-13 ( Add Sort Functionality )

- IN 'products.js' [Controller folder]
```js
const Product = require('../models/products')

const getAllProducts = async(req,res) => {
  const {company, name, price, featured, rating, sort} = req.query
  const queryObject = {}
  if (company){
    queryObject.company = company
  } 
  if (name){
    queryObject.name = { $regex: name, $options: 'i'}
  } 
  if (price){
    queryObject.price = price
  } 
  if (featured){
    queryObject.featured = featured
  } 
  if (rating){
    queryObject.rating = rating
  } 

  let apiData = Product.find(queryObject)
  // to add sort functionality
  if(sort){
    let sortFix = sort.split(",").join(" ")
    apiData = apiData.sort(sortFix)
  }

  const mydata = await apiData
  res.status(200).json({mydata})
}

/* const getAllProductsTesting = async(req,res) => {
  res.status(200).json({msg: 'I am getAllProductsTesting'})
} */

module.exports = {getAllProducts, getAllProductsTesting}
```
### V-14 ( Return specific Document Fields using Select in Mongoose )

-  IN 'products.js' [Controller folder]
add this code

// To give only particular document using select
  if(select){
    let selectFix = select.split(",").join(" ")
    apiData = apiData.select(selectFix)
  }

  const mydata = await apiData
  res.status(200).json({mydata})

```js
const Product = require('../models/products')

const getAllProducts = async(req,res) => {
  const {company, name, price, featured, rating, sort, select} = req.query
  const queryObject = {}
  if (company){
    queryObject.company = company
  } 
  if (name){
    queryObject.name = { $regex: name, $options: 'i'}
  } 
  if (price){
    queryObject.price = price
  } 
  if (featured){
    queryObject.featured = featured
  } 
  if (rating){
    queryObject.rating = rating
  } 

  let apiData = Product.find(queryObject)
  // to add sort functionality
  if(sort){
    let sortFix = sort.split(",").join(" ")
    apiData = apiData.sort(sortFix)
  }

  // To give only particular document using select
  if(select){
    let selectFix = select.split(",").join(" ")
    apiData = apiData.select(selectFix)
  }

  const mydata = await apiData
  res.status(200).json({mydata})
}

const getAllProductsTesting = async(req,res) => {
  res.status(200).json({msg: 'I am getAllProductsTesting'})
}

module.exports = {getAllProducts, getAllProductsTesting}
```

### V-15 ( Add pagination )
-  IN 'products.js' [Controller folder]
add this code
// pagination functionality
  let page = Number(req.query.page)
  let limit = Number(req.query.limit) 
  let skip = (page-1) * limit

  apiData = apiData.skip(skip).limit(limit)

  const mydata = await apiData
  res.status(200).json({mydata, Total_data: mydata.length})

```js
const Product = require('../models/products')

const getAllProducts = async(req,res) => {
  const {company, name, price, featured, rating, sort, select} = req.query
  const queryObject = {}
  if (company){
    queryObject.company = company
  } 
  if (name){
    queryObject.name = { $regex: name, $options: 'i'}
  } 
  if (price){
    queryObject.price = price
  } 
  if (featured){
    queryObject.featured = featured
  } 
  if (rating){
    queryObject.rating = rating
  } 

  let apiData = Product.find(queryObject)
  // to add sort functionality
  if(sort){
    let sortFix = sort.split(",").join(" ")
    apiData = apiData.sort(sortFix)
  }

  // To give only particular document using select
  if(select){
    let selectFix = select.split(",").join(" ")
    apiData = apiData.select(selectFix)
  }

  // pagination functionality
  let page = Number(req.query.page)
  let limit = Number(req.query.limit) 
  let skip = (page-1) * limit

  apiData = apiData.skip(skip).limit(limit)

  const mydata = await apiData
  res.status(200).json({mydata, Total_data: mydata.length})
}

const getAllProductsTesting = async(req,res) => {
  res.status(200).json({msg: 'I am getAllProductsTesting'})
}

module.exports = {getAllProducts, getAllProductsTesting}
```

### Host API 

- Download "github cli" from -> https://cli.github.com/
- Install it and add it path to environment variable under 'system variable' path
- Restart pc
-  Open vs code terminal and run the following command to check if cli is installed or not
-  gh
-  git init
-  git add .
-  git commit -m 'testing'
-  git branch
-  gh repo new
  Or watch my youtube channel babadeepakji to learn how to upload project on github
