const mongoose = require('mongoose');

// Data Scheme
const DataSchema = mongoose.Schema({
  author:{
    type: String
  },
  title:{
    type: String
  },
  body:{
      type: String
  },
  date:{
    type: String
  }
});
const Data = module.exports = mongoose.model('Data', DataSchema);