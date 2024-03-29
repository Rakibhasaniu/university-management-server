import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import   { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from 'bcryptjs'
import { createToken } from "./auth.utils";
import jwt  from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";
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

    const accessToken = createToken(jwtPayload,config.jwt_access_secret as string,config.jwt_access_expires as string);
    const refreshToken = createToken(jwtPayload,config.jwt_refresh_secret as string,config.jwt_refresh_expires as string);
    // const refreshToken =jwt.sign(
    //     jwtPayload,
    //     config.jwt_access_secret as string,
    //     {expiresIn:'10d'}
    // );


        return {
            accessToken,
            refreshToken,
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

const refreshToken = async(token:string) => {
    // checking if the token is missing
    // if (!token) {
    //     throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    //   }
  
      // checking if the given token is valid
      const decoded = jwt.verify(
        token,
        config.jwt_refresh_secret as string,
      ) as JwtPayload;
  
      const {  userId, iat } = decoded;
  
      // checking if the user is exist
      const user = await User.isUserExistsByCustomId(userId);
  
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
      }
      // checking if the user is already deleted
  
      const isDeleted = user?.isDeleted;
  
      if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
      }
      const userStatus = user?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    const jwtPayload = {
        userId: user.id,
        role:user.role,
    }
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires as string
    )
    return {accessToken};

}
const forgetPassword = async(id:string) => {
    const user = await User.isUserExistsByCustomId(id);
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND,'This User In Not Found')
    }
    const isDeleted = user?.isDeleted;
  
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }
    const userStatus = user?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    const jwtPayload = {
        userId: user.id,
        role:user.role,
    }
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        '10m'
    )

    const resetUiLink = `${config.reset_pass_ui_link}?id=${user.id}&token=${accessToken}`
    // console.log(resetUiLink)
    sendEmail(user.email, resetUiLink)
}

const resetPassword = async(payload : {id: string, newPassword : string},token : string) => {
    const user = await User.isUserExistsByCustomId(payload?.id);
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND,'This User In Not Found')
    }
    const isDeleted = user?.isDeleted;
  
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }
    const userStatus = user?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }
    const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
        if(payload.id !== decoded.userId){
            throw new AppError(httpStatus.FORBIDDEN,"You can not change other users password");
        }

        const newHashedPassword = await bcrypt.hash(payload?.newPassword,Number(config.bcrypt_salt_rounds))

        await User.findOneAndUpdate({
            id:decoded.userId,
            role:decoded.role,
        },
        {
            password:newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt:new Date(),
        }
        );
}

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
}