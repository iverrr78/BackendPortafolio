import express from 'express';
import bodyParser from 'body-parser';
import {Routes} from './src/routes/routes.js';
import { sequelize } from './postgres.js';
import {errorhandler} from './src/middlewares/error.handler.js'
import passport from './utils/index.js';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

const main = async () =>{

    dotenv.config();

    await sequelize.sync({force: false});

    let app = express();

    app.use(express.static('./src/public'));

    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(cors({
        origin: 'https://portafolio-snowy-nine.vercel.app', // Permite solo este dominio
        methods: 'GET,POST,PATCH,DELETE',
        allowedHeaders: 'Content-Type,Authorization'
    }
    ));

    app.use(passport.initialize())

    app.use(helmet());

    app.use(bodyParser.json());

    app.use(errorhandler);

    Routes(app);

    app.listen(process.env.PORT);
    console.log('La aplicacion esta escuchando en el puerto 3001');
}

main();