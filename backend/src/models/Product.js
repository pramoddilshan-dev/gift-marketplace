import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 150]
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },

    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "products",
    timestamps: true,
    indexes: [
      { fields: ["seller_id"] },
      { fields: ["is_active"] }
    ]
  }
);

User.hasMany(Product, { foreignKey: "seller_id", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "seller_id" });

export default Product;
