const isAdmin = (req, res, next) => {
    const role = req.user.role
    if (role !== 'admin' && role !== 'super_admin') {
        return res.status(403).json({ success: false, message: 'คุณไม่ได้รับอนุญาตให้ดำเนินการนี้' });
    }
    next();
};

module.exports = isAdmin;