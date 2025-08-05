import User from "../../models/user.js"
import { Op } from "sequelize"
const validateAvailability = async (req,res,next) => {
    try{
        const userWithSameEmail = await User.findOne({
            where: { email: req.body.email }
        });

        if (userWithSameEmail)
            return res.status(401).send({ msg: "Email already in use!" });

        if (req.body.role === 'Admin') {
            return res.status(401).send({ msg: "Admin role is not allowed for user creation!" });
        }
        next()
    }catch(err){
        throw new Error(err)
    }
}

export default validateAvailability