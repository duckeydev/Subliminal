module.exports = async (req, res, next) => {
    if (!req.session.token) { 
        res.redirect('/')
    }
    return next();
};