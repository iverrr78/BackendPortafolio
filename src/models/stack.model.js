import { DataTypes } from "sequelize";
import { sequelize } from "../../postgres.js";

const Stack = sequelize.define(
    "Stack",
    {
        name:{
            allowNull: false,
            type:DataTypes.STRING, 
        }
    },
    {
        timestamps: false,
    }
);

export {Stack};