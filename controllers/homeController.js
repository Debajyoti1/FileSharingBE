const User = require('../models/user')

module.exports.home = async (req, res) => {
    // console.log(req.cookies);
    // res.cookie('b','c')
    try {
        return res.status(200).json({
            message: "Hello World"
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}