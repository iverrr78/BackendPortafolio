import dotenv from 'dotenv';
import { Projects } from "../models/project.model.js";
import { Category } from "../models/category.model.js";
import { Stack } from "../models/stack.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config()

const HOST = process.env.HOST;
const PORT = process.env.PORT;


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
            image: project.image
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
    const project = req.body
    try{
        const newProjects = await Projects.create({
                english_name: project.name_english,
                spanish_name: project.name_spanish, 
                english_description: project.description_english,
                spanish_description: project.description_spanish, 
                link: project.link, github: project.github,
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

//update project
async function patchProjects (req, res){
    const id = req.query.id;

    console.log("id", req.query.id);
    console.log("body", req.body)

    const project = JSON.parse(req.body.body);
    
    try{
        await Projects.update({
            english_name: project.name_english,
            spanish_name: project.name_spanish,
            english_description: project.description_english,
            spanish_description: project.description_spanish,
            id_category: project.id_category,
            github: project.github,
            link: project.link,
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
    let ids = req.query.id;
    if(!Array.isArray(ids)){
        let newids = [];
        newids.push(ids);
        ids = newids; 
    }

    try{
        ids.forEach(element => {
            Projects.destroy({ where: {id: element}});
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