module.exports = function() {
    return {
        indexController: function(req, res, next) {
            
            req.params.id = req.params.id || 0;
            
            res.render('item.html.twig', {
                param: req.params.id
            });
        },
    }
};