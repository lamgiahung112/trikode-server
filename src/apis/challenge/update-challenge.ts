import { ChallengeDetailsModel, ChallengeModel, TestCaseModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { Handler } from "express"

const UpdateChallengeHandler: Handler = async (req, res, next) => {
	try {
		const reqBody = req.body as Request.UpdateChallengeRequest

		const challenge = await ChallengeModel.findOne({ _id: reqBody._id })
		const challengeDetails = await ChallengeDetailsModel.findOne({
			_id: challenge?.challengeDetails,
		})
		const testcases = await TestCaseModel.find({ challengeId: challenge?._id })

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

		// TODO: update constraints
		await challenge.save()
		await challengeDetails.save()

		next()
	} catch {
		next(new ApiError("Failed to update challenge!", HttpCode.BAD_REQUEST))
	}
}

export default UpdateChallengeHandler
