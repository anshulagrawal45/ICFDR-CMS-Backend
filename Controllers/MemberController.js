const { MemberModel } = require("../Model.js");
const jwt = require('jsonwebtoken');
const secret = 'accha-theekHai-samajhGaya';
exports.memberLoginController = async (req, res) => {
    const { phone, dob } = req.body;

    const member = await MemberModel.findOne({ phone });
    if (!member) {
        return res.json({ message: 'User Not Found' });
    }

    if (member.dob !== dob) return res.json({ message: 'DOB does not match !' });
    user = JSON.parse(JSON.stringify(member))
    const token = jwt.sign({ userId: user._id }, secret);

    res.send({...user,token})
}
