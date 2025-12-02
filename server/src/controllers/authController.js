import User from "../models/User.js";

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

        // Create User
        const user = await User.create({
            name,
            email,
            password,   // PAssword should always be hashed
        });

        if(user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email
            }) 
        } else {
            return res.status(400).json({message: "Invalid User data, try again"})
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message})
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
