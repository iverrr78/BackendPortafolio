import { Strategy } from "passport-local";
import bcrypt from "bcrypt";

const LocalStrategy = new Strategy(async (username, password, done)=>{
    const adminPassword = process.env.ADMIN_PASSWORD;
    try{
        //const isMatch = await bcrypt.compare(password, adminPassword);
        const isMatch = (adminPassword == password)?true:false
        if(isMatch){
            done(null, {"message":"password matched"});
        }else{
            const error = new Error('the provided password doesnt match');
            done(error, null);
        }
    }catch(err){
        done(err, null);
    }
});

export {LocalStrategy}