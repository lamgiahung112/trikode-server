import { Handler } from "express"
import { UserModel } from "../../db/mongoose"
import HttpCode from "../../utils/http-code"
import ApiError from "../../utils/api-error"
import bcrypt from "bcrypt"

const SignUpHandler: Handler = async (req, res, next) => {
	try {
		const body = req.body as Request.SignUp

		const newUser = new UserModel({
			...body,
			password: await bcrypt.hash(body.password, 12),
			role: "USER",
		})

		const createdUser = await newUser.save()
		res.locals = {
			payload: createdUser,
		}
		next()
	} catch {
		next(new ApiError("Failed to create user", HttpCode.INTERNAL_ERROR))
	}
}

export default SignUpHandler
