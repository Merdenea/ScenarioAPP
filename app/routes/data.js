const express = require('express');
const router = express.Router();

// Data Model
let Data = require('../models/data');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_data', { 
    title:'New Log'
  });
});

//format date and time
function formatDate(date) {
  let monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  let day = date.getDate();
  let monthIndex = date.getMonth();
  let year = date.getFullYear();
  let hh = date.getHours();
  let mm = date.getMinutes();

  return hh + ':' + mm + ', ' + day + ' ' + monthNames[monthIndex] + ' ' + year;
}


// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_data', {
      title:'New Log',
      errors:errors
    });
  } else {
    let data = new Data();
    data.title = req.body.title;
    data.author = req.user._id;
    data.date = formatDate(new Date());
    data.body = req.body.body;

    data.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Log Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Data.findById(req.params.id, function(err, data){
 /*   if(data.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }*/
    res.render('edit_data', {
      title:'Edit Log',
      data: data
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let data = {};
  data.title = req.body.title;
  data.author = req.user._id;
  data.date = formatDate(new Date());
  data.body = req.body.body;
  let query = {_id:req.params.id}

  Data.update(query, data, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Log Updated');
      res.redirect('/');
    }
  });
});

// Delete Data
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Data.findById(req.params.id, function(err, data){
      Data.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
  });
});


//Search logs

router.post('/search', function(req,res){

  req.checkBody('search','Search term is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_data', {
      title:'New Log',
      errors:errors
    });
  }
  else{
    let query = {title: { $regex: '.*' + req.body.search + '.*', $options: 'i' },
                 author: req.user._id};
    let caseSensitivity = {$caseSensitive: false};
    Data.find(query, caseSensitivity,function(err, results){
      res.render('index', {
        title: 'Search Results',
        datares: results
      })
    });
  }
});


// Get Single Data
router.get('/:id', function(req, res){
  Data.findById(req.params.id, function(err, data){
    User.findById(data.author, function(err, user){
      res.render('data', {
        data:data
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
