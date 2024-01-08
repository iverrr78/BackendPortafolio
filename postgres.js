import Sequelize from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // db name,
  process.env.DB_USER, // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    define:{
      freezeTableName: true
    },
  }
);

export {sequelize};

/*const sequelize = new Sequelize(
  "portafolio-blog", // db name,
  "postgres", // username
  "root", // password
  {
    host: "localhost",
    dialect: "postgres",
    define:{
      freezeTableName: true
    },
  }
);

export {sequelize};*/