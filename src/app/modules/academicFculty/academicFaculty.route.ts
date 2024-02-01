import express from 'express'
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyController } from './academicFaculty.controller';

const router = express.Router();


router.post('/create-academic-faculty',validateRequest(AcademicFacultyValidation.createAcademicFacultyValidationSchema),AcademicFacultyController.createAcademicFaculty);

router.get('/:facultyId',AcademicFacultyController.getSingleAcademicFaculty);

router.patch('/:facultyId',validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidationSchema),AcademicFacultyController.updateAcademicFaculty);

router.get('/',AcademicFacultyController.getAllAcademicFaculty);

export const AcademicFacultyRoutes = router;