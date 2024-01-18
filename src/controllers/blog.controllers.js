import {Blog} from '../models/asociations.js';
import { Category } from '../models/asociations.js';


//------------- Traditional controllers ------------------

// get all blogs
async function getAllBlogs (req, res){
    try{
        const allBlogs = await Blog.findAll({
            include: Category,
        });
      
        // Map the blogs array to include the categoryIds
        const blogsWithCategoryIds = allBlogs.map((blog) => ({
            id: blog.id,
            english_name: blog.englis_name,
            english_text: blog.english_text,
            spanish_name: blog.spanish_name,
            spanish_text: blog.spanish_text,
            image: blog.image,
            categoryIds: blog.Categories.map((category) => category.id),
        }));
        res.json(blogsWithCategoryIds);
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

// get blog by id
async function getBlogById (req, res){
    try{
        const result = await Blog.findByPk(req.query.id);
        res.json(result);
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

// add a blog
async function postBlogs (req, res){
    const blog = req.body
    try{
    const newBlog = await Blog.create({
        englis_name: blog.name_english, 
        english_text: blog.text_english,
        spanish_name: blog.name_spanish,
        spanish_text: blog.text_spanish,});
        
        if (blog.id_category && blog.id_category.length > 0) {
            const selectedCategories = await Category.findAll({
            where: {
                    id: blog.id_category,
                }
            })
            await newBlog.setCategories(selectedCategories);
        }

        res.json("Blog succesfully added");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

//update blogs
async function patchBlogs (req, res){
    const update = req.body;
    const id = req.query.id;

    try{
        newblog = await Blog.update({
            english_name: update.name_english,
            english_text: update.text_english,
            spanish_name: update.name_spanish,
            spanish_text: update.text_spanish,
            id_category: update.id_category,
        },{where:{
            id: id
            }});

        res.json("blog updated correctly");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}


//delete blogs by id
async function deleteBlogs (req, res){
    let ids = req.query.id;
    if(!Array.isArray(ids)){
        let newids = [];
        newids.push(ids);
        ids = newids; 
    }

    try{
        ids.forEach(element => {
            Blog.destroy({ where: {id: element}});
        });

        res.json("Blogs succesfully deleted");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

const blogController = {
    'get': getAllBlogs,
    'getById': getBlogById,
    'patch': patchBlogs,
    'post': postBlogs,
    'delete': deleteBlogs,
}

export {blogController};