var Controller = require('advanced').Controller;

module.exports = Controller.extend({
    index: function() {
        this.render('index.swig', {test: 1});
    }
});