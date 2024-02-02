
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester..model';
// import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';
  
  //find academicSemester info
  const admissionSemester = await AcademicSemester.findById(studentData.admissionSemester)


  const session = await mongoose.startSession()
  try{
    session.startTransaction()
    //set generated it
  userData.id = await generateStudentId(admissionSemester);

  // create a user
  const newUser = await User.create([userData],{session});

  //create a student
  if (!newUser.length) {
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to create User')
  }
    // set id , _id as user
    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id; //reference _id

    const newStudent = await Student.create([studentData],{session});
    if(!newStudent.length){
      throw new AppError(httpStatus.BAD_REQUEST,'Failed to create Student')
    }
    await session.commitTransaction()
    await session.endSession();

    return newStudent;

  } catch(err){
    await session.abortTransaction();
    await session.endSession();

  }
};

export const UserServices = {
  createStudentIntoDB,
};
