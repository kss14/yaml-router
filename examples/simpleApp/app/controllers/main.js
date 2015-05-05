module.exports = function() {
    return {
        homeController: function(req, res, next) {
            res.render('index.html.twig', {});
        },
        aboutController: function(req, res, next) {
            res.render('about.html.twig', {});
        }
    }
};