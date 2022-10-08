import User from "../models/userModel.js";
import jwt from "jsonwebtoken";


const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null
                next();
            }
            else {
                const user = await User.findById(decodedToken.userId)
                res.locals.user = user
                next();
            }
        })
    } else {
        res.locals.user = null
        next();
    }

}



const authenticatieToken = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err) => {

                if (err) {
                    console.log(err.message);
                    res.redicret("/login")
                } else {
                    next()
                }
            })
        } else {
            res.redicret("/login");
        } 

    } catch (error) {
        res.status(401).json({
            succeded: false,
            error: "Not authorized",
        });
    }

};

export { authenticatieToken, checkUser };