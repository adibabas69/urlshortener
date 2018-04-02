
// init project
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express();
const shortUrl = require("./models/shortUrl")

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());


//Connet to database
mongoose.connect("mongodb://adibabas:adibabas@ds123129.mlab.com:23129/api_project").then(
  () => { console.log("connected") },
  err => { console.log(err) }
);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
// app.use(express.static(__dirname + 'public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

// Simple in-memory store
app.get('/new/:urlToShorten(*)',(req,res,next)=>{
  var urlToShorten = req.params.urlToShorten;
  
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  
  var regex = expression;
  
 if(regex.test(urlToShorten)===true) {
   var short = Math.floor(Math.random() * 100000).toString(); 
   
   var data = new shortUrl({
     originalUrl : urlToShorten,
     shorterUrl : short
   });
   
   data.save(function(err){
   if(err){
     return res.send("Error save to database");
   }
   });
   
 return res.json(data)
 }
  
  var data = new shortUrl({
  originalUrl: 'URL entered does not follow the correct format',
  shorterUrl : 'Invalid URL'
  });
  
  return res.json(data);
});

//Query database and forward to originalURL
app.get ("/:urlToForward",function (req,res,next){
 var shorterUrl = req.params.urlToForward;
         
shortUrl.findOne({'shorterUrl': shorterUrl},function(err,data)
{
  if (err) return res.send("Error reading database");
  
  var re = new RegExp ("^(http|https)://", "i");
  var strToCheck = data.originalUrl;
  
  if(re.test(strToCheck)){
    res.redirect(301,data.originalUrl);
  }
  else
  {
     res.redirect(301, 'http://' + data.originalUrl);
  }

});
         });

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})


