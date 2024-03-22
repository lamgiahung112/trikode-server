import { Handler } from "express"
import HttpCode from "@src/utils/http-code"
import ApiError from "@src/utils/api-error"
import jwt from "jsonwebtoken"

const SpecifiedUserOnlyHandler: Handler = (req, res, next) => {
	try {
		const bearerToken = req.headers["authorization"]
		const { userId } = req.body as Request.SpecifiedUserOnlyRequest

		if (!bearerToken || !bearerToken.startsWith("Bearer ") || !userId) {
			throw new Error()
		}

		const authToken = bearerToken.substring(7)
		const userData = jwt.verify(
			authToken,
			process.env.JWT_SECRET as string
		) as AuthenticatedUserInfo

		if (userId !== userData.id) {
			throw new Error()
		}

		res.locals = {
			authenticatedUser: userData,
		}
		next()
	} catch {
		next(
			new ApiError(
				"You are not allowed to access this feature!",
				HttpCode.UNAUTHORIZED
			)
		)
	}
}

export default SpecifiedUserOnlyHandler
