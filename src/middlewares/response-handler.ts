import { Handler } from "express"
import HttpCode from "@src/utils/http-code"
import ApiResponse from "@src/utils/api-response"
import ApiError from "@src/utils/api-error"

const ResponseHandler: Handler = (req, res, next) => {
	try {
		const { payload } = res.locals
		const response = ApiResponse.builder().isSuccess(true).payload(payload).build()
		res.send(response)
	} catch {
		next(new ApiError("Internal Server Error!", HttpCode.INTERNAL_ERROR))
	}
}

export default ResponseHandler
