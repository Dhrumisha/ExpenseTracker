import bcrypt from 'bcrypt';
import crypto from 'crypto';
const jwt = require('jsonwebtoken');

export const passwordFormat = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

export const hashPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        console.log(error);
    }
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    }
    catch (error) {
        console.log(error);
    }
}

export const generateToken = async (id:String) => {
   return jwt.sign({ userId: id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );
}

export const passwordResetToken = async () => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    return resetToken;
}

export const getMonthName = (index: number) => {
   const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August", "September",
    "October", "November", "December"
   ];

   return months[index];
}