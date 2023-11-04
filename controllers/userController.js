const User = require('../models/user')
const jwt = require('jsonwebtoken')


//Create JWT token for a user
module.exports.signin = async (req, res) => {

    try {
        let existingUser = await User.findOne({ email: req.body.email })
        if (!existingUser || existingUser.password != req.body.password) {
            return res.status(401).json({
                message: 'Invalid credential'
            })
        }
        else {
            existingUser = existingUser.toJSON()
            delete existingUser['password']
            return res.status(200).json({
                message: 'Sign in successful',
                data: {
                    token: jwt.sign(existingUser, process.env.SECRET || 'sample-secret123', { expiresIn: '1d' })
                }
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

//Create a user and store in DB
module.exports.signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(500).json({
                message: 'Email already exists'
            })
        }
        const newUser = await User.create(req.body);
        return res.status(200).json({
            message: 'Sign up successful',
            user: {
                id: newUser.id,
                email: req.body.email
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

//Get JWT logged in profile details
module.exports.profile = async (req, res) => {
    try {
        const existingUser = req.user.toJSON()
        delete existingUser['password']
        return res.status(200).json({
            user: existingUser
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

//Get a profile by it's email params field
module.exports.profileByEmail = async (req, res) => {
    try {
        let existingUser = await User.findOne({ email: req.params.email });
        if (existingUser) {
            existingUser = existingUser.toJSON()
            delete existingUser['password']
            return res.status(200).json({
                user: existingUser
            })
        }
        else {
            return res.status(404).json({
                message: 'Profile page not found'
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

//Update user profile details follwed by JWT Auth
module.exports.update = (req, res) => {
    // console.log(req.user);
    res.json({ 'hi': 'hello' })
}