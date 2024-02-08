import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";


const loginUser = async(payload: TLoginUser) => {
    const isUserExists = await User.findOne({id: payload?.id})
    console.log(isUserExists);
    if(!isUserExists){
        throw new AppError(httpStatus.NOT_FOUND,'This User Not Found')
    }
}

export const AuthServices = {
    loginUser,

}