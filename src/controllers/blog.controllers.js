import dotenv from 'dotenv';
import {Blog} from '../models/asociations.js';
import { Category } from '../models/asociations.js';
import { Storage } from '@google-cloud/storage';

dotenv.config()

const GOOGLEKEY = process.env.GOOGLE_APPLICATION_CREDENTIALS_CONTENT;
const PROJECT_ID = process.env.PROJECT_ID;
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;

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
            imageurl: blog.imageurl,
            imagename: blog.imagename,
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
    //console.log("body", req.file);
    //res.json("hola");
    const blog = JSON.parse(req.body.body);
    const image = req.file

    const storageClient = new Storage({
        projectId: PROJECT_ID,
        keyFilename: GOOGLEKEY,
      });
    const bucketName = 'portafolio12';
    var url;
    var gcsFileName;

    if (image) {
        const bucket = storageClient.bucket(bucketName);
        gcsFileName = Date.now() + '_' + image.originalname;
        const blob = bucket.file(gcsFileName);
        const blobStream = blob.createWriteStream();

        blobStream.on('finish', async () => {
            const [url1] = await blob.getSignedUrl({
              action: 'read',
              expires: '01-01-3000',
            });
            url = url1

            try{
                const newBlog = await Blog.create({
                    englis_name: blog.name_english, 
                    english_text: blog.text_english,
                    spanish_name: blog.name_spanish,
                    spanish_text: blog.text_spanish,
                    imageurl: url,
                    imagename: gcsFileName
                });
                    
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
                    console.log("error:", err.message);
                    return res.status(500).json({message: err.message });
                }
        });

        blobStream.on('error', (err) => {
            console.error('Error al escribir en GCS:', err);
            // Manejar el error
        });

        blobStream.end(req.file.buffer);
    } else {
        url = DEFAULT_IMAGE;
        gcsFileName = 'defaultimage.jpg';

        try{
            const newBlog = await Blog.create({
                    englis_name: blog.name_english, 
                    english_text: blog.text_english,
                    spanish_name: blog.name_spanish,
                    spanish_text: blog.text_spanish,
                    imageurl: url,
                    imagename: gcsFileName
                });
                
                if (blog.id_category && blog.id_category.length > 0) {
                    const selectedCategories = await Category.findAll({
                    where: {
                        id: blog.id_category,
                    }
                })
    
                    await newBlog.setCategories(selectedCategories);
                }
    
            res.json("Projects succesfully added");
        }
        catch(err){
            return res.status(500).json({message: err.message });
        }
    }
}

//update blogs
async function patchBlogs (req, res){
    const update = req.body;
    const id = req.query.id;
    const image = req.file
    const storageClient = new Storage({
        projectId: PROJECT_ID,
        keyFilename: GOOGLEKEY,
      });

    var url
    var gcsFileName;

    if (image) {
        const bucket = storageClient.bucket(bucketName);
        gcsFileName = Date.now() + '_' + image.originalname;
        const blob = bucket.file(gcsFileName);
        const blobStream = blob.createWriteStream();

        blobStream.on('finish', async () => {
            const [url1] = await blob.getSignedUrl({
              action: 'read',
              expires: '01-01-3000',
            });
            url = url1
        });

        if (project.imagename != "defaultimage.jpg"){
            const previousimage = bucket.file(project.imagename);
            previousimage.delete()
                .then(() => {
                    console.log(`La imagen ${project.imagename} se ha eliminado correctamente.`);
                })
                .catch((err) => {
                    console.error(`Error al eliminar la imagen ${project.imagename}:`, err);
                });     
        }
    } else {
        url = project.imageurl;
        gcsFileName = project.imagename;
    }

    try{
        await Blog.update({
            english_name: update.name_english,
            english_text: update.text_english,
            spanish_name: update.name_spanish,
            spanish_text: update.text_spanish,
            id_category: update.id_category,
            imageurl: url,
            imagename: gcsFileName
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
    const storageClient = new Storage({
        projectId: PROJECT_ID,
        keyFilename: GOOGLEKEY,
      });
    const bucketname = 'portafolio12';

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

        console.log("previousimagename:", req.query);
        const previousimagename = req.query.previousimagename;
        const previousimage = storageClient.bucket(bucketname).file(previousimagename);
        
        previousimage.delete()
            .then(() => {
                console.log(`La imagen ${previousimagename} se ha eliminado correctamente.`);
            })
            .catch((err) => {
                console.error(`Error al eliminar la imagen ${previousimagename}:`, err);
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