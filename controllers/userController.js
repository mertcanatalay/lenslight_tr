import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Photo from "../models/photoModel.js";

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ user: user._id });
    } catch (error) {


        let errors2 = {};

        if (error.code === 11000) {
            errors2.email = "The email is allready registered"
        }

        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach((key) => {
                errors2[key] = error.errors[key].message;
            });
        }

        console.log("errors2:", errors2)

        res.status(400).json(errors2);
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body; // username ve passwordü bodyden aldık

        const user = await User.findOne({ username }); //db ile gelen aynı mı 

        let same = false;

        if (user) {
            same = await bcrypt.compare(password, user.password); // eğer ki şifreler eşleşiyosa  same doğru olusa true ya döner

        } else {
            return res.status(401).json({
                succeded: false,
                error: "There is no such user",
            });
        }

        if (same) {  //şifrelerin durumu

            const token = createToken(user._id) // jwt oluşturduk
            res.cookie("jwt", token, { //cokie oluşturduk
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            });

            res.redirect("/users/dashboard"); // şifreler eşleşiyosa
        } else {
            res.status(401).json({ // şiferler eşleşmiyosas
                succeded: false,
                error: "Password are not matched"
            });
        }

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        })
    }
};

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

const getDashboardPage = async (req, res) => {
    const photos = await Photo.find({ user: res.locals.user._id })
    res.render('dashboard', {
        link: 'dashboard',
        photos
    });
}


export { createUser, loginUser, getDashboardPage };