import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import  jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from 'bcrypt'

const loginUser = async(payload: TLoginUser) => {
    const user = await User.isUserExistsByCustomId(payload.id)
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND,'This User Not Found')
    }
    if(user.isDeleted){
        throw new AppError(httpStatus.FORBIDDEN,'This User Is Deleted')
    }
    if(user.status === 'blocked'){
        throw new AppError(httpStatus.FORBIDDEN,'This User Is Blocked')
    }
    if(! await(User.isPasswordMatched(payload?.password,user?.password))){
        throw new AppError(httpStatus.FORBIDDEN,'Password Is Not Matched')
    } 

    const jwtPayload = {
        userId:user.id,
        role:user.role,
    }

    const accessToken =jwt.sign(
        jwtPayload,
        config.jwt_access_secret as string,
        {expiresIn:'10d'}
    );


        return {
            accessToken,
            needsPasswordChange: user?.needsPasswordChange,
        }
    
}

const changePassword = async(userData:JwtPayload, payload:{oldPassword: string,newPassword: string}) => {
    const user = await User.isUserExistsByCustomId(userData.userId)
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND,'This User Not Found')
    }
    if(user.isDeleted){
        throw new AppError(httpStatus.FORBIDDEN,'This User Is Deleted')
    }
    if(user.status === 'blocked'){
        throw new AppError(httpStatus.FORBIDDEN,'This User Is Blocked')
    }
    if(! await(User.isPasswordMatched(payload?.oldPassword,user?.password))){
        throw new AppError(httpStatus.FORBIDDEN,'Password Is Not Matched')
    } 

    //hashed new password
    const newHashedPassword = await bcrypt.hash(payload?.newPassword,Number(config.bcrypt_salt_rounds))
    await User.findOneAndUpdate({
        id:userData.userId,
        role:userData.role,
    },
    {
        password:newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt:new Date(),
    }
    );
    return null;
}

export const AuthServices = {
    loginUser,
    changePassword
}