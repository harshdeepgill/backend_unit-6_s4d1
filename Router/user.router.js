const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Model/user.model");
const { BlacklistModel } = require("../Model/blacklist.model");
require("dotenv").config();



const userRouter = express.Router();

userRouter.post("/register",  (req, res) => {
    const {username, email, password} = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if(err){
                res.send({"msg": err});
            }else{
                req.body.password = hash;
                const user = new UserModel(req.body);
                await user.save();
                res.status(200).send({"msg": "New User registered.", "user": user});
            }
        });
        
    } catch (err) {
        res.send({"error": err});
    }
})

userRouter.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        var token = jwt.sign({ id: user._id }, process.env.key);

        if(user){
            bcrypt.compare(password, user.password, async (err, result) => {
                if(result){
                    res.status(200).send({"msg": "Login Success!", "token": token});
                }else{
                    res.status(200).send({"msg": "Password did not match!"});
                }
            });
        }else{
            res.status(400).send({"msg": "You are not registered!"})
        }
        
    } catch (err) {
        res.send({"error": err});
    }
})

userRouter.get("/logout", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const blacklist = new BlacklistModel({token});
        await blacklist.save();
        res.status(200).send({"msg": "Successfully logged out!"});
    } catch (err) {
        res.send({"msg": err});
    }
})


module.exports = {userRouter}