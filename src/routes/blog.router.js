import {Router} from 'express';
import {blogController} from '../controllers/blog.controllers.js';
import { validationhandler, validateid } from '../middlewares/validation.handler.js';
import { blog } from '../dot/validator.js';
import {singleid} from '../dot/validator.js';
import passport from 'passport';
import {upload} from '../middlewares/upload.handler.js';

const routes = {
    blogGetAll: '/getAll',
    blogGetById: '/getById',
    blogPost: '/post',
    blogUpdate: '/update',
    blogDeleteById: '/deleteById',
    blogDeleteAll: '/deleteAll',
    blogUpload: '/upload'
}

const routerBlogs = Router();

routerBlogs.get(routes.blogGetAll, (req,res)=>{
    blogController.get(req, res);
});

routerBlogs.get(routes.blogGetById, (req, res)=>{
    blogController.getById(req,res);
})

routerBlogs.post(routes.blogPost, passport.authenticate('jwt',{session:false}), upload.single('image'), validationhandler(blog), (req, res)=>{
    blogController.post(req, res);
});

routerBlogs.patch(routes.blogUpdate, passport.authenticate('jwt',{session:false}), validateid(singleid), validationhandler(blog), (req, res)=>{
    blogController.patch(req, res);
})

routerBlogs.delete(routes.blogDeleteById, passport.authenticate('jwt',{session:false}), validateid(singleid), (req,res)=>{
    blogController.delete(req,res);
})


export {routerBlogs};