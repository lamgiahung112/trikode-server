import { ChallengeDetailsModel, ChallengeModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { Handler } from "express"
import fs from "fs"

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

		const testWriter = fs.createWriteStream(
			`./tests/${savedChallenge._id.toString()}.json`,
			{
				autoClose: true,
			}
		)
		testWriter.on("error", () => {
			throw new Error()
		})
		testWriter.write(JSON.stringify(reqBody.testcases))

		res.locals = {
			payload: savedChallenge,
		}
		next()
	} catch {
		next(new ApiError("Failed to create challenge!", HttpCode.BAD_REQUEST))
	}
}

export default CreateChallengeHandler
