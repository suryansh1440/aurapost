import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


export const protect = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized", success: false })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
        next();
    } catch (error) {
        console.log("error in protect middleware", error.message);
        return res.status(500).json({ message: error.message, success: false })
    }
}