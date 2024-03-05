import { DataTypes } from "sequelize";
import { sequelize } from "../../postgres.js";

  const Blog = sequelize.define(
  "Blog",
  {
    englis_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    english_text: {
        allowNull: false,
        type: DataTypes.TEXT
    },
    spanish_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    spanish_text: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    imageurl: {
      type: DataTypes.TEXT,
    },
    imagename: {
      type: DataTypes.TEXT,
    }
  },
  {
    timestamps: false,
  }
);
//Creacion del modelo de cancha para sequalize



export {Blog};