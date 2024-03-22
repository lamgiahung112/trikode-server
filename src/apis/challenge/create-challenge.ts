import { ChallengeDetailsModel, ChallengeModel, TestCaseModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { Handler } from "express"

const CreateChallengeHandler: Handler = async (req, res, next) => {
	try {
		const reqBody = req.body as Request.CreateChallengeRequest

		const challengeDetail = new ChallengeDetailsModel({
			description: reqBody.description,
			predefinedCode: reqBody.predefinedCode,
			exampleTestCases: reqBody.exampleTestCases,
			constraints: reqBody.constraints,
		})

		const savedChallengeDetails = await challengeDetail.save()

		const challenge = new ChallengeModel({
			title: reqBody.title,
			difficulty: reqBody.difficulty,
			tags: reqBody.tags,
			createdAt: new Date().getTime(),
			submissionCount: 0,
			acceptanceCount: 0,
			likeCount: 0,
			challengeDetails: savedChallengeDetails._id.toString(),
		})

		const savedChallenge = await challenge.save()
		const testcases = reqBody.testcases.map(
			(test) =>
				new TestCaseModel({ ...test, problemId: savedChallenge._id.toString() })
		)
		await TestCaseModel.bulkSave(testcases)

		res.locals = {
			payload: savedChallenge,
		}
		next()
	} catch {
		next(new ApiError("Failed to create challenge!", HttpCode.BAD_REQUEST))
	}
}

export default CreateChallengeHandler
