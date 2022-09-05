import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            succeded: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body; // username ve passwordü bodyden aldık
       
        const user = await User.findOne({ username }); //db ile gelen aynı mı 
       
        let same = false;

        if (user) {
            same = await bcrypt.compare(password, user.password); // eğer ki şifreler eşleşiyosa  same doğru olusa true ya döner
           
        }else {
            return res.status(401).json({
                succeded:false,
                error:"There is no such user",
            });
        }

        if (same) {  //şifrelerin durumu
            res.status(200).json({
                user,
                token: createToken(user._id)
            });  // şifreler eşleşiyosa
        }else {
            res.status(401).json({ // şiferler eşleşmiyosas
                succeded:false,
                error:"Password are not matched"
            });
        }

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        })
    }
};

const createToken =  (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"1d",
    });
};



export { createUser, loginUser };