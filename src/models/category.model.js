import {sequelize} from "../../postgres.js"
import { DataTypes } from "sequelize"

const Category = sequelize.define(
    "Category",
    {
        name:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
)

export {Category};