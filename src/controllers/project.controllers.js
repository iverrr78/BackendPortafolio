import dotenv from 'dotenv';
import { Projects } from "../models/project.model.js";
import { Category } from "../models/category.model.js";
import { Stack } from "../models/stack.model.js";
import { Storage } from '@google-cloud/storage';

dotenv.config()

const GOOGLEKEY = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_CONTENT);
const PROJECT_ID = process.env.PROJECT_ID;
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;


//------------- Traditional controllers ------------------

// get all projects
async function getAllProjects (req, res){
    try{
        const allProjects = await Projects.findAll({
            include: [{
                model: Category,
                attributes: ['id'], // Include only specific attributes from the Category model
              },
              {
                model: Stack,
                attributes: ['id'], // Include only specific attributes from the Stack model
              }
            ]});
        

        // Map the blogs array to include the categoryIds
        const projectsWithCategoryIdsStackIds = allProjects.map((project) => ({
            id: project.id,
            name_spanish: project.spanish_name,
            name_english: project.english_name,
            description_spanish: project.spanish_description,
            description_english: project.english_description,
            link: project.link,
            github: project.github,
            categoryIds: project.Categories.map((category) => category.id),
            satckIds: project.Stacks.map((stack)=> stack.id),
            imageurl: project.imageurl,
            imagename: project.imagename
        }));
        res.json(projectsWithCategoryIdsStackIds);
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

// get project by id
async function getProjectById (req, res){
    try{
        const result = await Projects.findByPk(req.query.id);
        res.json(result);
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

// post project
async function postProjects (req, res){
    const project = JSON.parse(req.body.body);
    const image = req.file

    const storageClient = new Storage({
        projectId: PROJECT_ID,
        credentials: GOOGLEKEY,  // Changed from keyFilename to credentials
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

            url = url1;
            try{
                const newProjects = await Projects.create({
                        english_name: project.name_english,
                        spanish_name: project.name_spanish, 
                        english_description: project.description_english,
                        spanish_description: project.description_spanish, 
                        link: project.link, github: project.github,
                        imageurl: url,
                        imagename: gcsFileName
                    });
                    
                    if (project.id_category && project.id_category.length > 0) {
                        const selectedCategories = await Category.findAll({
                        where: {
                            id: project.id_category,
                        }
                    })
        
                        await newProjects.setCategories(selectedCategories);
                    }
        
                    if(project.id_stack && project.id_stack.length > 0){
                        const selectedStacks = await Stack.findAll({
                           where:{
                            id: project.id_stack,
                           } 
                        })
        
                        await newProjects.setStacks(selectedStacks);
                    }
        
                res.json("Projects succesfully added");
            }
            catch(err){
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
            const newProjects = await Projects.create({
                    english_name: project.name_english,
                    spanish_name: project.name_spanish, 
                    english_description: project.description_english,
                    spanish_description: project.description_spanish, 
                    link: project.link, github: project.github,
                    imageurl: url,
                    imagename: gcsFileName
                });
                
                if (project.id_category && project.id_category.length > 0) {
                    const selectedCategories = await Category.findAll({
                    where: {
                        id: project.id_category,
                    }
                })
    
                    await newProjects.setCategories(selectedCategories);
                }
    
                if(project.id_stack && project.id_stack.length > 0){
                    const selectedStacks = await Stack.findAll({
                       where:{
                        id: project.id_stack,
                       } 
                    })
    
                    await newProjects.setStacks(selectedStacks);
                }
    
            res.json("Projects succesfully added");
        }
        catch(err){
            return res.status(500).json({message: err.message });
        }
    }
}

//update project
async function patchProjects (req, res){
    const id = req.query.id;
    const project = req.body
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
        await Projects.update({
            english_name: project.name_english,
            spanish_name: project.name_spanish,
            english_description: project.description_english,
            spanish_description: project.description_spanish,
            id_category: project.id_category,
            github: project.github,
            link: project.link,
            imageurl: url,
            imagename: gcsFileName
            },{where:{
                id: id
            }});

        res.json("projects updated correctly");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}

//delete blogs
async function deleteProjects (req, res){
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

    console.log("id:", ids);

    try{
        ids.forEach(element => {
            Projects.destroy({ where: {id: element}});
        });

        const previousimagename = req.query.previousimagename;
        const previousimage = storageClient.bucket(bucketname).file(previousimagename);
        
        previousimage.delete()
            .then(() => {
                console.log(`La imagen ${previousimagename} se ha eliminado correctamente.`);
            })
            .catch((err) => {
                console.error(`Error al eliminar la imagen ${previousimagename}:`, err);
            });

        res.json("Projects succesfully deleted");
    }
    catch(err){
        return res.status(500).json({message: err.message });
    }
}


const projectController = {
    'get': getAllProjects,
    'getById': getProjectById,
    'patch': patchProjects,
    'post': postProjects,
    'delete': deleteProjects
}

export {projectController};