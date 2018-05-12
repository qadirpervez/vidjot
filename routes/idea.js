const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose');
// Load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');


Router.get('/', (req, res) => {
  Idea.find({}).sort({date: 'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    });
  });
});
Router.get('/add', (req, res) => {
  res.render('ideas/add');
});
Router.post('/', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({ text: "Please add a title" });
  }
  if(!req.body.details){
    errors.push({ text: "Please add some details"});
  }
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      slug: req.body.title.replace(/ /g, '_')
    };

    new Idea(newUser).save().then(idea => {
      req.flash('success_msg', 'Video Idea added.');
      res.redirect('/ideas');
    });
  }
});
Router.get('/edit/:id/:slug', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  });
});
Router.put('/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.slug = req.body.title.replace(/ /g, '_');
    idea.save().then(idea => {
      req.flash('success_msg', 'Video Idea Updated.');
      res.redirect('/ideas');
    });
  });
});
Router.delete('/:id', (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Video Idea removed.');
    res.redirect('/ideas');
  });
});


module.exports = Router;
