import {Router} from 'express';
import { categoryController } from '../controllers/category.controllers.js';
import { category, singleid } from '../dot/validator.js';
import { validateid, validationhandler } from '../middlewares/validation.handler.js';
import passport from 'passport';

const routes = {
    categoryGetAll:'/getAll',
    categoryGetById: '/getById',
    categoryPost: '/post',
    categoryPatch: '/update',
    categoryDelete: '/delete'
}

const routerCategories = Router();

routerCategories.get(routes.categoryGetAll, (req, res)=>{
    categoryController.get(req, res);
})

routerCategories.get(routes.categoryGetById, (req, res)=>{
    categoryController.getById(req, res);
})

routerCategories.post(routes.categoryPost, passport.authenticate('jwt',{session:false}), (req, res)=>{
    categoryController.post(req, res);
})

routerCategories.patch(routes.categoryPatch, passport.authenticate('jwt',{session:false}), validationhandler(category), (req, res)=>{
    categoryController.patch(req, res);
})

routerCategories.delete(routes.categoryDelete, passport.authenticate('jwt',{session:false}), validateid(singleid), validationhandler(category), (req, res)=>{
    categoryController.delete(req, res);
})

export {routerCategories};