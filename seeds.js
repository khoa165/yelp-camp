var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
    name: "Peace",
    image: "https://images.unsplash.com/photo-1571069756236-9d9322054086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1190&q=80",
    description: "Beautiful white and black house in a peaceful area."
  },
  {
    name: "Wet",
    image: "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1088&q=80",
    description: "Green forest for campers, bring tents to stay overnight."
  },
  {
    name: "Foggy",
    image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
    description: "Imagine wake up in the early morning and enjoy yourself on top of the moutain surrounded by fog."
  },
  {
    name: "Blinking",
    image: "https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
    description: "What's better than a night lying on the grass looking up to the magical sky with thousands of stars blinking at you."
  },
  {
    name: "Friends",
    image: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    description: "Enjoy the precious time with your friends, warming yourself up with some marshmallows melted on the fire."
  }
]

function seedDB() {
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Remove all campgrounds.");
      data.forEach(function(seed) {
        Campground.create(seed, function(err, campground) {
          if (err) {
            console.log(err);
          } else {
            console.log("A campground added.");
            Comment.create({
              text: "Awesome place!",
              author: "Camper"
            }, function(err, comment) {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("A new comment created.");
              }
            });
          }
        });
      });
    }
  });
}

module.exports = seedDB;
