const mongoose = require('mongoose');

// Data Scheme
const DataSchema = mongoose.Schema({
  user:{
    //use email
    type: String
  },
  text:{
      type: String
  }  
});
const Data = module.exports = mongoose.model('Data', DataSchema);