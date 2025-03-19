import express from "express";
import passport from "passport";
import jwt  from "jsonwebtoken";

const routerAuth= express.Router();

routerAuth.post('/', passport.authenticate('local', {session:false}) ,
(req, res, next)=>{
    try{
        const secret = process.env.JWT_SECRET ;
        const user = req.user;
        const payload = {
            sub: 1,
            role: 'customer'
        }
        const token = jwt.sign(payload, secret);
        res.json({user,
        token})
    }catch(err){
        next(err)
    }
});


routerAuth.get('/', passport.authenticate('jwt', {session:false}), (req,res)=>{
    res.json("hola que tal");
});

export {routerAuth};