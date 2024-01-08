import { sequelize } from "../../postgres.js";
import { Projects } from "./project.model.js";
import { Stack } from "./stack.model.js";
import {Category} from './category.model.js';
import {Blog} from "./blog.model.js"

Projects.belongsToMany(Stack, {through: 'ProyectStack'});
Stack.belongsToMany(Projects, {through: 'ProyectStack'});

Projects.belongsToMany(Category, {through: 'ProjectCategory'});
Category.belongsToMany(Projects, {through: 'ProjectCategory'});

Category.belongsToMany(Blog, { through: 'BlogCategory' });
Blog.belongsToMany(Category, { through: 'BlogCategory' });

export {Projects, Stack, Category, Blog};