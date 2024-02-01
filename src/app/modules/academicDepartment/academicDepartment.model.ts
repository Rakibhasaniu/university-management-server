import { Schema, model } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";


const academicDepartmentSchema = new Schema<TAcademicDepartment>(
    {
        name:{
            type: String,
            required: true,
            unique: true,
        },
        academicfaculty:{
            type:Schema.Types.ObjectId,
            ref:'AcademicFaculty',
        }
    },{
        timestamps: true,
    },
);



academicDepartmentSchema.pre('findOneAndUpdate',async function(next){
    const query = this.getQuery();

    const isDepartmentExist = await AcademicDepartment.findOne(query);
    if(!isDepartmentExist){
        throw new AppError(httpStatus.NOT_FOUND,'This Department Does not Exist')
    }
    next();
})

export const AcademicDepartment = model<TAcademicDepartment>('AcademicDepartment',academicDepartmentSchema)