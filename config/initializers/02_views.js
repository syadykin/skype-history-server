var consolidate = require('consolidate'),
    swig = require('swig');

module.exports = function() {
    this.set('views', __dirname + '/../../app/views');
    this.set('view engine', 'swig');
    this.engine('swig', consolidate.swig);
    swig.Swig({
        root: this.get('views'),
        allowErrors: true,
        varControls: ["<%=", "%>"],
        tagControls: ["<%", "%>"]
    });
};
