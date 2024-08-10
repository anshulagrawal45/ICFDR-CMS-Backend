const jwt = require('jsonwebtoken');
const { UsersModel, MemberModel } = require('../Model');
const secret = 'accha-theekHai-samajhGaya';
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token)
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, secret, async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const user = await UsersModel.findById(decoded.userId)
        const member = await MemberModel.findById(decoded.userId)
        console.log(member)
        if (!user && !member) return res.sendStatus(404);
        req.user = user;
        next();
    });
}