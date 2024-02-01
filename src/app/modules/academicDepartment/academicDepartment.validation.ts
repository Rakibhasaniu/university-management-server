import { z } from "zod";


const createAcademicDepartmentValidationSchema = z.object({
    body:z.object({
        name:z.string({
            invalid_type_error:'Academic Department Must Be String',
            required_error:'Name Is Required',
        }),
        academicfaculty:z.string({
            invalid_type_error:'Academic Faculty Must Be String',
            required_error:'Faculty is Required'
        })
    })
})
const updateAcademicDepartmentValidationSchema = z.object({
    body:z.object({
        name:z.string({
            invalid_type_error:'Academic Department Must Be String',
            required_error:'Academic Department Is Required',
        }).optional(),
        academicfaculty:z.string({
            invalid_type_error:'Academic Faculty Must Be String',
            required_error:'Academic Faculty is Required'
        }).optional()
    })
})

export const AcademicDepartmentValidation = {
    createAcademicDepartmentValidationSchema,
    updateAcademicDepartmentValidationSchema,
}