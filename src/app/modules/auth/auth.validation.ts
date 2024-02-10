import { z } from "zod";


const loginValidationSchema = z.object({
    body:z.object({
        id:z.string({
            required_error:'Id is required'
        }),
        password:z.string({
            required_error:'Password id required',
        })
    })
})
const changePasswordValidationSchema = z.object({
    body:z.object({
        oldPassword:z.string({
            required_error:'Old Password Is Required'
        }),
        newPassword:z.string({
            required_error:'Password id required',
        })
    })
})

export const AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema
}