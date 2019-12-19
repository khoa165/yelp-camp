var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

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
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  Campground.create({name: name, price: price, image: image, description: description, author: author}, function(err, camp) {
    if (err) {
      res.redirect("/campgrounds/new");
    } else {
      res.redirect("/campgrounds");
    }
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
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, camp) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
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
