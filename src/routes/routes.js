import express from 'express';
import {routerCategories} from './category.router.js'
import {routerBlogs} from './blog.router.js'
import { routerProjects } from './project.router.js';
import { routerStacks } from './stack.router.js';
import { routerAuth } from './auth.router.js';

function Routes (Server){
    Server.use('/category', routerCategories );
    Server.use('/blog', routerBlogs);
    Server.use('/project', routerProjects);
    Server.use('/stack', routerStacks);
    Server.use('/auth', routerAuth);
}

export {Routes};