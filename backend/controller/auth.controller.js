import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {generateTokenandSetCookie} from "../utils/generateTokenandSetCookie.js";  
import { sendpasswordResetEmail, sendVerificationEmail , sendWelcomeEmail ,sendResetSuccessEmail} from "../mailtrap/email.js";
import crypto from "crypto";


export const signup = async(req, res) => {
const { name, email, password } = req.body;

try {
    if(!name || !email || !password){
        throw new Error({ message: "All fields are required" });
    }

const existingUser = await User.findOne({ email });
if(existingUser){
    console.log("User already exists");
    return res.status(400).json({success:false, message: "User already exists" });
}

const hashpassword = await bcrypt.hash(password, 10);
const verificationToken = Math.floor(100000 + Math.random() * 900000).toString() // Generate a 6-digit verification code;
const user = new User({
    name,
    email,
    password: hashpassword,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24*60*60*1000 
});
await user.save();

// Send verification email

 generateTokenandSetCookie(user._id, res);

await sendVerificationEmail(user.email, verificationToken);

res.status(201).json({ success: true, message: "User registered successfully",
    user: {
        ...user._doc,
        password: undefined,
    },
}); 
} catch (error) {
   res.status(400).json({ success: false, message: error.message }); 
}
};

export const verifyEmail = async(req, res) => {
    const { code } = req.body;

    try {
    const user = await User.findOne(
        { verificationToken: code, verificationTokenExpiresAt: { $gt: Date.now() }, }    
    );
    if(!user){
        return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({ success: true, message: "Email verified successfully" ,
     user:{
        ...user._doc,
        password: undefined,
     }
    })
} catch (error) {
    res.status(400).json({ success: false, message: error.message });
}
}

export const login = async(req, res) => {
   const {email, password} = req.body;
   try {
    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    if(!user.isVerified){
        return res.status(400).json({ success: false, message: "Please verify your email" });
    }
    generateTokenandSetCookie(user._id, res);

   user.lastLogin = Date.now();
   await user.save();

    res.status(200).json({ success: true, message: "User logged in successfully",
    user: {
        ...user._doc,
        password: undefined,
    }
    });

   } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ success: false, message: "Server error" });
   }
    
};

export const logout = async(req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User logged out successfully" });   
};

export const forgotPassword = async(req,res)=>{
    const {email} = req.body;
   try {
   const user = await User.findOne({email});

   if(!user){
    return res.status(400).json({ success: false, message: "User not found" });
   }

//generate reset token
const resetToken = crypto.randomBytes(20).toString("hex");
const resetTokenExpiresAt = Date.now() + 1*60*60*1000; //1hour

user.resetPasswordToken = resetToken;
user.resetPasswordExpiresAt = Date.now() + 24*60*60*1000; // 1 day

await user.save();

//send email

await sendpasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
res.status(200).json({ success: true, message: "Password reset email sent" });

} catch (error) {
    res.status(400).json({ success: false, message: error.message });
}
};

export const resetPassword = async(req,res) =>{
    try {
        const {token} =req.params;
       const {password} = req.body;

       const user = await User.findOne({
        resetPasswordToken:token,
        resetPasswordExpiresAt:{$gt:Date.now()},
       });

    if(!user){
     return res.status(400).json({ success: false, message: "Invalid or expired password reset token" });  
    }

    //update password

    const hashedPassword = await bcrypt.hash(password,10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.log("Error in reset password ",error);
        res.status(400).json({success:false, message: error.message})
    }
}

export const checkAuth = async(req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User authenticated", user});
          
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}