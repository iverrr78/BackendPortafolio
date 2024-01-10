import Sequelize from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions:{
      ssl:{
        require:true,
        rejectUnauthorized:false,
      }
    }
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