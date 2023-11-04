const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET || 'sample-secret123',

};

//This is a middleware which validates JWT token and if successful, it stores the user in req.user and pass it to next()
passport.use('jwt',new JWTstrategy(options, async (jwtPayload, done) => {
  try {
    const existingUser = await User.findById(jwtPayload._id);
    if (existingUser) {
      return done(null, existingUser);
    } else {
      return done(null, false, { status: 401, message: 'message: Unauthorized' });
    }
  } catch (err) {
    console.log(err);
    return done(err, false, { status: 500, message: 'Internal Server Error' });
  }
}));


module.exports = passport