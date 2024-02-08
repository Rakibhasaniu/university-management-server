import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
// import bcrypt from 'bcrypt'

const loginUser = async(payload: TLoginUser) => {
    // console.log(isUserExists);
    const user = await User.isUserExistsByCustomId(payload.id)
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND,'This User Not Found')
    }
    const isDeleted = user.isDeleted
    // console.log(isUserExists);
    if(isDeleted){
        throw new AppError(httpStatus.FORBIDDEN,'This User Is Deleted')
    }
    const userStatus = user.status
    // console.log(isUserExists);
    if(userStatus === 'blocked'){
        throw new AppError(httpStatus.FORBIDDEN,'This User Is Blocked')
    }
    if(! await(User.isPasswordMatched(payload?.password,user?.password))){
        throw new AppError(httpStatus.FORBIDDEN,'Password Is Not Matched')
    } 
    
}

export const AuthServices = {
    loginUser,

}