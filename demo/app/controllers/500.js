var Advanced = require('advanced');

module.exports = Advanced.Controller.extend({
    index: function() {
        this.render('500.swig', {
            err: this.req.params[0],
            env: Advanced.Utils.c('env')
        });
    }
});