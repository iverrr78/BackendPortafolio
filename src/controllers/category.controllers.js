import { Category } from '../models/category.model.js';

//---------------------------Traditional controllers-------------------------------

// Get all the categories
async function getAllCategories(req, res){
    try{
        const results = await Category.findAll();
        res.json(results);
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

//Get categories by id
async function getCategoryById (req, res){
    try{
        const result = await Category.findByPk(req.query.id);
        res.json(result);
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

// Post a group of categories
function postCategories(req, res){
    const categories = req.body;

    try{
        categories.forEach(async element => {
            await Category.create({name: element.name, text: element.text, id_category: element.id_category});
        });

        res.json("Categories succesfully added");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

// update categories by ids
async function patchCategories (req, res){
    const update = req.body;
    const ids = req.query.id;
    if(!Array.isArray(ids)){
        newids = [];
        newids.push(ids);
        ids = newids;
    }

    try{
        ids.forEach(async (element,index) => {
            newcategories = await Category.update({
                name: update[index].name || element.name,
            },{where:{
                id: element
            }});
        });

        res.json("categories updated correctly");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

// delete categories by ids
async function deleteCategories(req, res){
    let ids = req.query.id;
    if(!Array.isArray(ids)){
        let newids = [];
        newids.push(ids);
        ids = newids; 
    }

    try{
        ids.forEach(element => {
            Category.destroy({ where: {id: element}});
        });

        res.json("Categories succesfully deleted");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

const categoryController = {
    'get': getAllCategories,
    'getById': getCategoryById,
    'post': postCategories,
    'patch': patchCategories,
    'delete': deleteCategories
}

export {categoryController};