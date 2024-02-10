import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import  jwt from "jsonwebtoken";
import config from "../../config";
// import bcrypt from 'bcrypt'

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

export const AuthServices = {
    loginUser,

}