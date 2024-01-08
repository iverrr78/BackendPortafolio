import dotenv from 'dotenv';
import {Strategy, ExtractJwt} from 'passport-jwt'

dotenv.config()

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

const JwtStrategy = new Strategy(options, (payload, done) =>{
    console.log("payload",payload);
    return done(null, payload);
});

export {JwtStrategy}