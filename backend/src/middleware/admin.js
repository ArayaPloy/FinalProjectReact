const isAdmin = (req, res, next) => {
    console.log(req.role)
    if (req.role !== 'admin' && req.role !== 'superadmin') {
        return res.status(403).json({ success: false, message: 'You are not authorized to perform this action.' });
    }
    next();
};

module.exports = isAdmin;