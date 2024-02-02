import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const getAllStudentsFromDB = async () => {
  const result = await Student.find().populate('admissionSemester').populate({
    path:'academicDepartment',
    populate:{
      path:'academicfaculty'
    }
  });
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id }).populate('admissionSemester').populate({
    path:'academicDepartment',
    populate:{
      path:'academicfaculty'
    }
  });
  return result;
};
const updateStudentIntoDB = async (id: string,payload) => {
  const result = await Student.findOne({ id })
  return result;
};

const deleteStudentFromDB = async (id: string) => {

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      {new: true, session},
       );
       if(!result){
        throw new AppError(httpStatus.BAD_REQUEST,'Failed to delete student')
       }
    const deleteUser = await User.findOneAndUpdate({
      id},
      { isDeleted: true },
      {new: true, session},
      );
      if(!deleteUser){
        throw new AppError(httpStatus.BAD_REQUEST,'Failed to delete User')
       }

       await session.commitTransaction();
       await session.endSession();
    return result;
  } catch (err) {
    // throw new AppError(httpStatus.BAD_REQUEST,'Failed to delete student')

    await session.abortTransaction();
    await session.endSession();
  }
  
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB
};
