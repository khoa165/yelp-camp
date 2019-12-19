var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, camp) {
      if (err || !camp) { // Handle error or when camp is not found.
        req.flash("error", "Campground not found!");
        res.redirect("back");
      } else {
        // camp.author.id  is an object, while req.user.id is a string, so === would return false.
        if (camp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to perform this action!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to perform this action!");
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err || !comment) {
        req.flash("error", "Comment not found!");
        res.redirect("back");
      } else {
        // comment.author.id  is an object, while req.user.id is a string, so === would return false.
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to perform this action!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to perform this action!");
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to perform this action!");
  res.redirect("/login");
}


module.exports = middlewareObj;
