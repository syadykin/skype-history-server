var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
    email: { type: String, index: { unique: true }},
    hash: String
});

schema.statics.registerUser = function(email, password, cb) {
    var Model = this;

    bcrypt.hash(password, 8, function(err, hash) {
        var user = new Model({ email:email, hash:hash });
        user.save(function(err) {
            cb(err, user);
        });
    });
};

schema.methods.validPassword = function(password, cb) {
    bcrypt.compare(password, this.hash, function(err, same) {
        cb(err, !err && same);
    });
};

module.exports = mongoose.model('User', schema);
