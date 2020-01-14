var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Schema setup
var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  admin: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMongoose, {usernameQueryFields: ['email'] });

var User = mongoose.model('User', UserSchema);

module.exports = User;
