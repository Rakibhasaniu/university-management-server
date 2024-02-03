import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async (query: Record<string,unknown>) => {

  const studentSearchAbleField = ['email','name.firstName','presentAddress'];

  let searchTerm='';
  if(query?.searchTerm){
    searchTerm=query?.searchTerm as string;
  }

  const searchQuery = Student.find(
    {
      $or:studentSearchAbleField.map((field) => ({
        [field] : {$regex: searchTerm,$options: 'i'},
      }))
    }
  )

  const result = await searchQuery.find(query).populate('admissionSemester').populate({
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
const updateStudentIntoDB = async (id: string,payload:Partial<TStudent>) => {

  const {name,guardian,localGuardian,...remainingStudentData} = payload;
  const modifiedUpdatedData: Record<string,unknown> ={...remainingStudentData} 

  if(name && Object.keys(name).length){
    for(const [key,value] of Object.entries(name)){
      modifiedUpdatedData[`name.${key}`]=value;
    }
  }
  if(guardian && Object.keys(guardian).length){
    for(const [key,value] of Object.entries(guardian)){
      modifiedUpdatedData[`guardian.${key}`]=value;
    }
  }
  if(localGuardian && Object.keys(localGuardian).length){
    for(const [key,value] of Object.entries(localGuardian)){
      modifiedUpdatedData[`localGuardian.${key}`]=value;
    }
  }


  const result = await Student.findOneAndUpdate({ id },modifiedUpdatedData,{new: true, runValidators: true})
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

    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to delete student')

  }
  
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB
};
