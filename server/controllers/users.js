var renderView = function( req, res ) {
    res.send('respond with a resource');    
};

module.exports = function(req, res, next) {
    renderView( req, res );
};