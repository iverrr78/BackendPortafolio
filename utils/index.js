import passport from "passport";
import { LocalStrategy } from "./auth/strategies/local.strategy.js";
import { JwtStrategy } from "./auth/strategies/jwt.strategy.js";

passport.use(LocalStrategy);
passport.use(JwtStrategy);

export default passport