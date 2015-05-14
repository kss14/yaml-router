module.exports = function() {
    return {
        getController: function(req, res, next) {
            res.render('about.html.twig', {
                foo: 'bar'
            });
        },
    }
};