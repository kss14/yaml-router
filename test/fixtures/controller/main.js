module.exports = function() {
    return {
        aboutController: function(req, res, next) {
            res.render('about.html.twig', {
                foo: 'bar'
            });
        },
        itemController: function(req, res, next) {
            res.render('item.html.twig', {
                foo: 'bar'
            });
        }
    }
};