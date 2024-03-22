import { ChallengeDetailsModel, ChallengeModel, TestCaseModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
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

		const testcasesToUpdate = testcases
			.filter((test) => test._id)
			.map((test) => new TestCaseModel({ ...test }))
		const testcasesToInsert = testcases
			.filter((test) => !test._id)
			.map((test) => new TestCaseModel({ ...test, challengeId: challenge._id }))

		await challenge.save()
		await challengeDetails.save()
		testcasesToUpdate.forEach(async (test) => {
			await TestCaseModel.findByIdAndUpdate(test._id, {
				$set: {
					challengeId: challenge._id,
					input: test.input,
					expectedOutput: test.expectedOutput,
				},
			})
		})
		await TestCaseModel.bulkSave(testcasesToInsert)

		next()
	} catch (err) {
		console.log(err)
		next(new ApiError("Failed to update challenge!", HttpCode.BAD_REQUEST))
	}
}

export default UpdateChallengeHandler
