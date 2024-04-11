import { ChallengeSubmissionModel, UserChallengeProgressModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import MqService from "@src/utils/mq-service"
import { Handler } from "express"

const SubmitChallengeCodeHandler: Handler = async (req, res, next) => {
	try {
		const reqBody = req.body as Request.SubmitChallengeCodeRequest
		const { id } = res.locals.authenticatedUser as AuthenticatedUserInfo

		const submission = new ChallengeSubmissionModel({
			challengeId: reqBody.challengeId,
			code: reqBody.code,
			userId: id,
			createdAt: new Date().getTime(),
			isPending: true,
		})

		const savedSubmission = await submission.save()
		const userChallengeProgress =
			(await UserChallengeProgressModel.findOne({
				userId: id,
				challengeId: reqBody.challengeId,
			})) ??
			new UserChallengeProgressModel({
				userId: id,
				challengeId: reqBody.challengeId,
			})

		if (userChallengeProgress.status !== "SOLVED") {
			userChallengeProgress.set("status", "ATTEMPTED")
		}
		await userChallengeProgress.save()

		MqService.sendRunCodeMessage({
			challengeId: reqBody.challengeId,
			submissionId: savedSubmission._id.toString(),
			code: reqBody.code,
		})

		next()
	} catch (err) {
		console.log(err)
		next(
			new ApiError(
				"Failed to submit your attempt for this challenge!",
				HttpCode.BAD_REQUEST
			)
		)
	}
}

export default SubmitChallengeCodeHandler
