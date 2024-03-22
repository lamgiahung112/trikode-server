import { Handler } from "express"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { UserModel } from "@src/db/mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SignInHandler: Handler = async (req, res, next) => {
	try {
		const reqBody = req.body as Request.SignIn

		const foundUser = await UserModel.findOne({ nickname: reqBody.nickname }).exec()

		if (!foundUser) {
			return next(new ApiError("User not found", HttpCode.NOT_FOUND))
		}

		const isCorrectPassword = await bcrypt.compare(
			reqBody.password,
			foundUser.password
		)

		if (!isCorrectPassword) {
			throw new Error()
		}

		const tokenData: Omit<AuthenticatedUserInfo, "iat" | "exp"> = {
			name: foundUser.name,
			email: foundUser.email,
			nickname: foundUser.nickname,
			role: foundUser.role,
			id: foundUser.id,
		}

		res.locals = {
			payload: jwt.sign(tokenData, process.env.JWT_SECRET as string, {
				expiresIn: process.env.JWT_EXPIRES,
			}),
		}
		next()
	} catch {
		next(new ApiError("Wrong nickname or password", HttpCode.BAD_REQUEST))
	}
}

export default SignInHandler
