import { Router } from "express";
import { projectController } from "../controllers/project.controllers.js";
import { proyect, singleid } from "../dot/validator.js";
import { validateid, validationhandler } from '../middlewares/validation.handler.js';
import {upload} from '../middlewares/upload.handler.js';
import passport from 'passport';

const routes = {
    projectGetAll:'/getAll',
    projectGetById: '/getById',
    projectPost: '/post',
    projectPatch: '/update',
    projectDelete: '/delete'
}

const routerProjects = Router();

routerProjects.get(routes.projectGetAll, (req, res)=>{
    projectController.get(req, res);
})

routerProjects.get(routes.projectGetById, (req, res)=>{
    projectController.getById(req, res);
})

routerProjects.post(routes.projectPost, passport.authenticate('jwt',{session:false}), upload.single('image'), validationhandler(proyect), (req, res)=>{
    projectController.post(req, res);
})

routerProjects.patch(routes.projectPatch, passport.authenticate('jwt',{session:false}), upload.single('image'), validateid(singleid), (req, res)=>{
    projectController.patch(req, res);
})

routerProjects.delete(routes.projectDelete, passport.authenticate('jwt',{session:false}), validateid(singleid), (req, res)=>{
    projectController.delete(req, res);
})

export {routerProjects};