const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const Admin = require("../models/admin.model");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, (payload, done) => {
            //console.log(payload)
            Admin.findOne({ _id: payload._id })
                .then((user) => {
                    if (!user) {
                        return done(null, false);
                    } else {
                        return done(null, user);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    return done(error);
                });
        })
    );
};
