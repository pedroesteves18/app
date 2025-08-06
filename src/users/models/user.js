
import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin','Contractor', 'Provider'),
    allowNull: false
  },
  perfilPhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  workingPictures: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  }
});

export default User