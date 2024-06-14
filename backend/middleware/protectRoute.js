import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    res.status(200);
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unauthorized no token provided "});
        }
        const decoded=jwt.verify(token , process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:"Unauthorized no token provided "});
        }
        const user=await User.findById(decoded.userId).select("-password");

        if(!user){
            res.status(404).json({error:"User Not Found "});
        }
        req.user = user
        
        next();

    }
    catch(error){
        console.log("Error in ProtectRoute Middleware",error.message);
        return res.status(500).json({error:"Internet server error"});
    }
};

export default protectRoute;