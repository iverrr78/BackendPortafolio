

const errorhandler = (err, req, res, next)=>{
    
    res.status(300).json(err.details[0].message);
}

export {errorhandler};