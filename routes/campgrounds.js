var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
var NodeGeocoder = require('node-geocoder');

// Configurations for geocoder.
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);

// Campground - Index
router.get("/", function(req, res) {
  Campground.find({}, function(err, camps) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {camps: camps});
    }
  });
});

// Campground - Create
router.post("/", middleware.isLoggedIn, function(req, res) {
  // Associate campground with user/owner.
  req.body.campground.author = {
    id: req.user._id,
    username: req.user.username
  };

  // Add geocoding data to campground.
  geocoder.geocode(req.body.campground.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    
    // Create a new campground and save to DB
    Campground.create(req.body.campground, function(err){
      if (err) {
        res.redirect("/campgrounds/new");
      } else {
        res.redirect("/campgrounds");
      }
    });
  });
});

// Campground - New
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// Campground - Show
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, camp) {
    if (err || !camp) {
      req.flash("error", "Campground not found!");
      res.redirect("back");
    } else {
      res.render("campgrounds/show", {camp: camp});
    }
  });
});

// Campground - Edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, camp) {
    res.render("campgrounds/edit", {camp: camp});
  });
});

// Campground - Update
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  geocoder.geocode(req.body.campground.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, camp){
      if(err){
          req.flash("error", err.message);
          res.redirect("back");
      } else {
          req.flash("success","Campground successfully updated!");
          res.redirect("/campgrounds/" + camp._id);
      }
    });
  });
});

// Campground - Destroy
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground successfully deleted!");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
