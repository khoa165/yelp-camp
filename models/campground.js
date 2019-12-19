var mongoose = require("mongoose");

// Schema setup
var CampgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// PRE HOOK THE MODEL, SO IF WE DELETE CAMPGROUNDS, WE DELETE ALL COMMENTS ON THAT CAMPGROUND
const Comment = require('./comment');
CampgroundSchema.pre('findByIdAndRemove', async function() {
  await Comment.remove({
    _id: {
      $in: this.comments
    }
  });
});

var Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
