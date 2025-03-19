import { sequelize } from "../../postgres.js";
import { DataTypes } from "sequelize";

const Projects = sequelize.define(
    "Projects",
    {
        english_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        spanish_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        english_description:{
            type: DataTypes.STRING,
        },
        spanish_description:{
            type: DataTypes.STRING,
        },
        imageurl:{
            type: DataTypes.TEXT,
        },
        imagename: {
            type: DataTypes.STRING,
        },
        github:{
            type: DataTypes.STRING,
            allowNull: true
        },
        link:{
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        timestamps: false
    }
)

export {Projects};