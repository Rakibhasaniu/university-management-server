import {z} from 'zod';

const createAcademicFacultyValidationSchema = z.object({
    body:z.object({
        name:z.string({
            invalid_type_error:'Academic Faculty Must Be String'
        })
    })
})
const updateAcademicFacultyValidationSchema = z.object({
    body:z.object({
        name:z.string({
            invalid_type_error:'Academic Faculty Must Be String'
        })
    })
})

export const AcademicFacultyValidation = {
    createAcademicFacultyValidationSchema,
    updateAcademicFacultyValidationSchema
    
}