import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import {envKeys} from "../utils/envKeys.js"

export async function registerUser (req, res) {
    try {
        const {name,email,password}=req.body
        // validation
        if(!name || !email || !password) {
            return res.status(400).json({message: "Please add all fields"});
        }
        // check if user exists
        const userExists = await User.findOne({email});

        if(userExists) {
            return res.status(400).json({message: "User already exist"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        // Create User
        const user = await User.create({
            name,
            email,
            password:hashedPassword,   // PAssword should always be hashed
        });

        if(user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token:generateToken(user._id),
            }) 
        } else {
            return res.status(400).json({message: "Invalid User data, try again"})
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message})
    }
}

export const loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});

        if(user &&(await bcrypt.compare(password,user.password))){
            res.json({
                _id:user.id,
                name:user.name,
                email:user.email,
                token:generateToken(user._id),
            });
        }else{
            res.status(400).json({message:"Invalid Credentials"});
        }
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

export const getMe=async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        res.status(500).json({message:error.message});
    }
}


export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const generateToken=(id)=>{
    return jwt.sign({id},envKeys.JWT_SECRET,{
        expiresIn:"30d",
    })
}