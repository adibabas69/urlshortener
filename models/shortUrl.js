
//declare bentuk database
//Template/Structure/model document for shortUrl
//Require mongoose

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UrlSchema = new Schema ({

  originalUrl : String,
  shorterUrl : String

}, {timestamps: true});


const ModelClass = mongoose.model('shortUrl', UrlSchema);

module.exports = ModelClass;