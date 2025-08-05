import sequelize from "./database.js";
import User from "../src/users/models/user.js";
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('💾 Database connection suceeded');

    await sequelize.sync({alter: true}); 
    console.log('📦 Tables synchronized');
  } catch (err) {
    console.error('❌ Error in database connection:', err);
  }
}

export default connection

