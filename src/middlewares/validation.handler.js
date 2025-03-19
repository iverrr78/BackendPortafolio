
function validateid(schema){
    return(req, res, next)=>{
    const {error} = schema.validate(parseInt(req.query.id));

    if(error){
        next(error);
    }
    else{
        next();
    }
}
}

function validationhandler(schema){
    return(req, res, next)=>{
        let data

        if(req.body.body == undefined){
            data = req.body;
        } else {
            data = JSON.parse(req.body.body);
        }


        const {error} = schema.validate(data);

        if(error){
            next(error);
        }
        else{
            next();
        }
    }
}

/*function validatearray(){
    return(req, res, next)=>{
        console.log(req.query)
    if(Array.isArray(req.query.id)){
        console.log("array");
        try{
        validateid(ids, req.query.id, next)();
        }
        catch(error){
            next(error);
        }
    }
    else{
        console.log("no array");
        try{
        validateid(singleid, req, next)();
        }
        catch(error){
            next(error);
        }
    }
}
}*/

export{validationhandler, validateid};