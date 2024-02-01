import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFaculty.service";


const createAcademicFaculty = catchAsync(async(req,res) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body)
    
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success: true,
        message:'Academic Faculty is created successfully',
        data: result,
    })
})
const getAllAcademicFaculty = catchAsync(async(req,res) => {
    const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB();

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Academic Faculty Retrieve Successfully',
        data: result,
    })
})
const getSinfleAcademicFaculty = cat

export const AcademicFacultyController = {
    createAcademicFaculty,
    getAllAcademicFaculty,


}