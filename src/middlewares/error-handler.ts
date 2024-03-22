import { ErrorRequestHandler } from "express"
import HttpCode from "@src/utils/http-code"
import ApiError from "@src/utils/api-error"
import ApiResponse from "@src/utils/api-response"

const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (err instanceof ApiError === false) {
		err = new ApiError("Internal Server Error!", HttpCode.INTERNAL_ERROR)
	}

	const response = ApiResponse.builder().isSuccess(false).message(err.message).build()
	res.status(err.code).send(response)
}

export default ErrorHandler
