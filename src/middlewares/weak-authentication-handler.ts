import { Handler } from "express"
import jwt from "jsonwebtoken"

const WeakAuthenticationHandler: Handler = (req, res, next) => {
	try {
		const bearerToken = req.headers["authorization"]

		if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
			return next()
		}

		const authToken = bearerToken.substring(7)
		const userData = jwt.verify(
			authToken,
			process.env.JWT_SECRET as string
		) as AuthenticatedUserInfo

		res.locals = {
			authenticatedUser: userData,
		}
		next()
	} catch {
		next()
	}
}

export default WeakAuthenticationHandler
