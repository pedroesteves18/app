
import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import User from "../../users/models/user.js";

const Service = sequelize.define('Service', {
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  workingPictures: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  }
});

User.hasMany(Service, { foreignKey: 'userId' });
Service.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE'
});

export default Service