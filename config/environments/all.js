module.exports = function() {
    this.datastore(require('locomotive-mongoose'));
    this.set('mongodb uri', process.env.MONGOHQ_URL || "mongodb://localhost/skype-history");
    this.set('sphinx host', 'localhost');
    this.set('sphinx port', 9312);
};
