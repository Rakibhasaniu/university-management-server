import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";



const loginUser = catchAsync(async(req,res) => {
    const result =await AuthServices.loginUser(req.body);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'User Login Successfully',
        data: result,
    })
})
const changePassword = catchAsync(async(req,res) => {
    const user = req.user;
    const {...passwordData} = req.body;
    const result =await AuthServices.changePassword(user,passwordData);
    console.log(req.user,req.body)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Password Change Successfully',
        data: null,
    })
})

export const AuthController = {
    loginUser,
    changePassword
}
export const AuthController = {
    loginUser,
    changePassword
}