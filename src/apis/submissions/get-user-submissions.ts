import { ChallengeSubmissionModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { Handler } from "express"
import { Types } from "mongoose"

const GetUserSubmissionHandler: Handler = async (req, res, next) => {
	try {
		const challengeId = req.query.challengeId
		const { id: userId } = res.locals.authenticatedUser as AuthenticatedUserInfo

		const submissions = await ChallengeSubmissionModel.aggregate([
			{
				$match: {
					challengeId: Types.ObjectId.createFromHexString(
						challengeId as string
					),
					userId: Types.ObjectId.createFromHexString(userId as string),
				},
			},
			{
				$project: {
					_id: 1,
					error: true,
					createdAt: true,
					challengeId: true,
					userId: true,
					isPassed: true,
					testcasePassedCount: true,
					totalTestCases: true,
					isPending: true,
				},
			},
		])
		res.locals = {
			payload: submissions,
		}
		next()
	} catch {
		next(
			new ApiError(
				"Failed to fetch your submissions for this challenge!",
				HttpCode.BAD_REQUEST
			)
		)
	}
}

export default GetUserSubmissionHandler
