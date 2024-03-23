import { Handler } from "express"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"

const VerifyHandler: Handler = async (req, res, next) => {
	try {
		if (!res.locals.authenticatedUser) {
			throw new Error()
		}
		res.locals.payload = res.locals.authenticatedUser
		next()
	} catch {
		next(new ApiError("Invalid credentials", HttpCode.UNAUTHORIZED))
	}
}

export default VerifyHandler
