import { ChallengeSubmissionModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { Handler } from "express"
import { Types } from "mongoose"

const GetSubmissionDetailsHandler: Handler = async (req, res, next) => {
	try {
		const submissionId = req.query.submissionId
		const { id: userId } = res.locals.authenticatedUser as AuthenticatedUserInfo

		const submission = await ChallengeSubmissionModel.aggregate([
			{
				$match: {
					_id: Types.ObjectId.createFromHexString(submissionId as string),
					userId: Types.ObjectId.createFromHexString(userId),
				},
			},
		]).limit(1)
		res.locals = {
			payload: submission[0],
		}
		next()
	} catch {
		next(
			new ApiError(
				"Failed to fetch details for this submission!",
				HttpCode.BAD_REQUEST
			)
		)
	}
}

export default GetSubmissionDetailsHandler
