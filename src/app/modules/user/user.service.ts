/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester..model';
// import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateAdminId, generateFacultyId, generateStudentId } from './user.utils';
import mongoose from 'mongoose';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../faculty/faculty.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';
  userData.email=studentData.email
  
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
    throw new AppError(httpStatus.BAD_REQUEST,'err')

  }
};

const createAdminIntoDB = async(password:string,payload: TAdmin)=>{
const userData: Partial<TUser> = {};

userData.password = password || (config.default_password as string);

userData.role = 'admin';
userData.email=payload.email

const session = await mongoose.startSession();
try {
  session.startTransaction();

  userData.id = await generateAdminId();

  const newUser = await User.create([userData],{session});

  if(!newUser.length){
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to create user')
  }

  payload.id=newUser[0].id;
  payload.user=newUser[0]._id;

  const newAdmin = await Admin.create([payload],{session});
  if(!newAdmin.length){
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to create Admin')
  }

  await session.commitTransaction();
  await session.endSession();
  // console.log(newAdmin)
  return newAdmin;

} catch (err: any) {
  // console.log(err);
  await session.abortTransaction();
  await session.endSession();
  throw new Error(err)
}
}

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'faculty';
  userData.email=payload.email


  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
    // console.log(academicDepartment)
  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
export const UserServices = {
  createStudentIntoDB,
  createAdminIntoDB,
  createFacultyIntoDB
};
