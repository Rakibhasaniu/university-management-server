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

const refreshTokenValidationSchema = z.object({
    cookies:z.object({
        refreshToken:z.string({
            required_error:'Refresh Token Is Required'
        })
    })
})

export const AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema
}