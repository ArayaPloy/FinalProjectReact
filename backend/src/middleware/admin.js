const isAdmin = (req, res, next) => {
    const role = req.user.role
    console.log(role)
    if (role !== 'admin' && role !== 'super_admin') {
        return res.status(403).json({ success: false, message: 'You are not authorized to perform this action.' });
    }
    next();
};

module.exports = isAdmin;