import { Stack } from "../models/stack.model.js";

//------------- Traditional controllers ------------------

// get all stacks
async function getAllStacks (req, res){
    try{
        const results = await Stack.findAll();
        res.json(results);
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

// get satck by id
async function getStackById (req, res){
    try{
        const result = await Stack.findByPk(req.query.id);
        res.json(result);
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

// post stacks
async function postStacks (req, res){

    const stack = req.body;

    try{
        await Stack.create({name: stack.name});

        res.json("Stacks succesfully added");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

//update stacks
async function patchStacks (req, res){
    const update = req.body;
    const ids = req.query.id;
    if(!Array.isArray(ids)){
        newids = [];
        newids.push(ids);
        ids = newids;
    }
    let newstacks

    try{
        ids.forEach(async (element,index) => {
            newstacks = await Stack.update({
                name: update[index].name || element.name,
            },{where:{
                id: element
            }});
        });

        res.json("stacks updated correctly");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

//delete stacks
async function deleteStacks (req, res){
    let ids = req.query.id;

    try{
        
        Stack.destroy({ where: {id: ids}});
        
        res.json("Stacks succesfully deleted");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}


const stackController = {
    'get': getAllStacks,
    'getById': getStackById,
    'patch': patchStacks,
    'post': postStacks,
    'delete': deleteStacks
}

export {stackController};