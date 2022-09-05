import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const authenticatieToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            succeded:false,
            error: 'no token aviable',
        });
    }

    req.user = await User.findById(
        jwt.verify(token,process.env.JWT_SECRET).userId
    );
        next();
};

export { authenticatieToken };