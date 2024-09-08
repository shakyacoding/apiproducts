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