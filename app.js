require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + 'public'));

mongoose.connect("mongodb://localhost:27017/secretsDB", { useUnifiedTopology: true, useFindAndModify: false, useNewUrlParser: true},
  function(err){
    if(err){
      console.log("Error Connecting to DB");
    } else {
      console.log("DB Connected");
    }
  }
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model("users", userSchema);




app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/login', function(req, res){
  User.findOne({email: req.body.username},
    function(err, data){
      if(data){
        if(data.password === md5(req.body.password)){
          res.render('secrets');
        }
        else{
          res.send("Credentials Incorrect");
        }
      }
    });
});

app.post("/register", function(req, res){
  var user = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  user.save(function(err){
    if(err){
      res.send(err);
    } else {
      res.render('secrets');
    }
  });
});


app.listen(3000, function(){
  console.log("Server Started on Port 3000");
});