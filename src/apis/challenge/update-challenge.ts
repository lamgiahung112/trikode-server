import { ChallengeDetailsModel, ChallengeModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import MqService from "@src/utils/mq-service"
import { Handler } from "express"

const UpdateChallengeHandler: Handler = async (req, res, next) => {
	try {
		const reqBody = req.body as Request.UpdateChallengeRequest

		const challenge = await ChallengeModel.findById(reqBody._id)
		const challengeDetails = await ChallengeDetailsModel.findById(
			challenge?.challengeDetails
		)
		const testcases = reqBody.testcases

		if (!challenge || !challengeDetails || !testcases) {
			throw new Error()
		}

		challenge.set("title", reqBody.title)
		challenge.set("tags", reqBody.tags)
		challenge.set("difficulty", reqBody.difficulty)

		challengeDetails.set("description", reqBody.description)
		challengeDetails.set("predefinedCode", reqBody.predefinedCode)
		challengeDetails.set("exampleTestCases", reqBody.exampleTestCases)
		challengeDetails.set("constraints", reqBody.constraints)

		await challenge.save()
		await challengeDetails.save()

		MqService.sendSaveTestCaseMessage({
			challengeId: challenge._id.toString(),
			testcases: reqBody.testcases,
		})

		next()
	} catch (err) {
		console.log(err)
		next(new ApiError("Failed to update challenge!", HttpCode.BAD_REQUEST))
	}
}

export default UpdateChallengeHandler
