const mongoose = require('mongoose');

const reviews_list = new mongoose.Schema({
  id: {
    type: Number,
    index: true
  },
  product_id: Number,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  reviewer_name: String,
  recommended: Boolean,
  summary: String,
  body: String,
  email: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  helpfulness: Number,
  photos: {
    type: [String],
    default: undefined
  }
});

const characteristicSchema = new mongoose.Schema({
  name: String,
  value: {
    type: Number,
    default: 3,
    min: 1,
    max: 5
  }
});

const products_meta = new mongoose.Schema({
  id: Number,
  '1_star': Number,
  '2_star': Number,
  '3_star': Number,
  '4_star': Number,
  '5_star': Number,
  recommended: Number,
  not_recommended: Number,
  characteristics: [characteristicSchema]
});

const emails = new mongoose.Schema({
  email: String,
  name: String
});
