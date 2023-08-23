import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc fetch all products
// @route GET/api/products
// @access Public

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  //checks if req.query.keyword is there and if it matches , options i is to make it case insensitive else {} nothing because we have no keyword
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i'} } : {};

  const count = await Product.countDocuments({...keyword });



  //get all the products from database
  //we pass in an empty object Product.find({}) because that will get all of them
  const products = await Product.find({...keyword})
  .limit(pageSize)
  .skip(pageSize * (page - 1)); //if we're on 3rd page then we'll skip the products from first and second page
  //return products, page
  res.json({products, page, pages: Math.ceil(count / pageSize)});
});

// @desc fetch all products by filters
// @route GET/api/products/filtered?gender=something&type=&something
// @access Public
const getFilteredProducts = asyncHandler(async (req, res) => {

  // similar with getProducts from above
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const selectedCategory = req.query.category;

  const { gender, type } = req.query;
  const filters = {};

  if (gender) {
    filters.gender = gender;
  }
  if (type) {
    filters.category = type;
  }

  const count = await Product.countDocuments({ ...filters });

  const products = await Product.find({ ...filters })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});


// @desc fetch all products
// @route GET/api/products/:id
// @access Public
// gets one product
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  //if there is a product, get it
  //if not, show error message
  if(product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// create a product
// POST /api/products
// private/admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Brand',
    category: 'Category',
    gender: 'Gender',
    countInStock: 0,
    numReviews: 0,
    description: 'Description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//update a product
// PUT /api/products/:id
// private & admin

const updateProduct = asyncHandler(async (req, res) => {
  //get all the products from database
  //we pass in an empty object Product.find({}) because that will get all of them
  const { name, gender, price, description, image, brand, category, countInStock} = req.body;
  
  const product = await Product.findById(req.params.id);

  if(product) {
    product.name = name;
    product.gender = gender;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Not found");
  }
});

// delete product
// PUT /api/products/:id
// private & admin

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if(product) {
    await Product.deleteOne({_id: product._id});
    res.status(200).json({message: 'Product succesfully deleted'});
  } else {
    res.status(404);
    throw new Error("Not found");
  }
});

// create review
// POST /api/products/:id/reviews
// private 

const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if(product) {
    const isReviewed = product.reviews.find(
      //the review's user matches to the logged in user's id
      (review) => review.user.toString() === req.user._id.toString()
    );

    //if the product is reviwed then show error
    if(isReviewed) {
      res.status(400);
      throw new Error("Prouct is already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    //push into reviews the new review
    product.reviews.push(review);

    //set numReviews to the length of existing reviews
    product.numReviews = product.reviews.length;

    //acc = accumulator, it accumulates the sum of all the ratings from "reviews" of the product object
    //reduce() is an array method that takes a callback function as an argument and returns a single accumulated value
    //based on the elements of the array
    //for each review in the "reviews" array the callback function adds the "review.rating" to the accumulator variable
    //the initial value of acc is set to 0
    //after iterating over all reviews, the sum of all ratings is stored in the acc
    //product rating is calculated by dividing the accumulated sum by the number of reviews. 
    //it represents the average rating for the product based on all the reviews
    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({message: "Review successfully added"})
  } else {
    res.status(404);
    throw new Error("not found");
  }

});

// @desc get the best rated products
// @route GET /api/products/best
// @access Public
const getBestProducts = asyncHandler(async (req, res) => {
  //getting products, sorting them and limiting them to only 3 products
  const products = await Product.find({}).sort({rating: -1}).limit(3);
  res.status(200).json(products); 
});


export { getProducts, getFilteredProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview, getBestProducts };