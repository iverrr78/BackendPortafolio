import {Router} from 'express';
import { stackController } from '../controllers/stack.controllers.js';
import { validationhandler } from '../middlewares/validation.handler.js';
import { stack } from '../dot/validator.js';
import passport from 'passport';

const routes = {
    stackGetAll: '/getAll',
    stackGetById: '/getById',
    stackPost: '/post',
    stackUpdate: '/update',
    stackDeleteById: '/deleteById',
    stackDeleteAll: '/deleteAll'
}

const routerStacks = Router();

routerStacks.get(routes.stackGetAll, (req,res)=>{
    stackController.get(req, res);
});

routerStacks.get(routes.stackGetById, (req, res)=>{
    stackController.getById(req,res);
})

routerStacks.post(routes.stackPost, passport.authenticate('jwt',{session:false}), validationhandler(stack), (req, res)=>{
    stackController.post(req, res);
});

routerStacks.patch(routes.stackUpdate, passport.authenticate('jwt',{session:false}), validationhandler(stack), (req, res)=>{
    stackController.patch(req, res);
});

routerStacks.delete(routes.stackDeleteById, passport.authenticate('jwt',{session:false}), (req,res)=>{
    stackController.delete(req,res);
});

export {routerStacks};