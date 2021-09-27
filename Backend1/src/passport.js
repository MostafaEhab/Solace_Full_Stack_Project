const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const UserModel = mongoose.model("User");
require("dotenv").config();

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      UserModel.findOne({ _id: jwt_payload.id })
        .then((user) => {
          if (user) {
            return done(null, jwt_payload);
          }
          return done(null, false);
        })
        .catch((err) => done(err, null));
    })
  );
};
