var mongoose = require("mongoose");

// Schema setup
var CommentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
