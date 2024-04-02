import { ChallengeModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { NextFunction, Request, Response } from "express"
import { PipelineStage } from "mongoose"

const GetChallengeDetails = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const reqBody = req.query as Request.ChallengeDetailsRequest
		const aggs: PipelineStage[] = [
			{
				$match: {
					title: {
						$regex: new RegExp(reqBody.titleSlug, "i"),
					},
				},
			},
			{
				$lookup: {
					from: "challengedetails",
					localField: "challengeDetails",
					foreignField: "_id",
					as: "details",
				},
			},
			{
				$project: {
					title: 1,
					difficulty: 1,
					tags: 1,
					submissionCount: 1,
					acceptanceCount: 1,
					likeCount: 1,
					details: { $arrayElemAt: ["$details", 0] },
				},
			},
		]
		const queriedChallenges = await ChallengeModel.aggregate(aggs).exec()

		res.locals = {
			payload: queriedChallenges,
		}
		next()
	} catch {
		next(
			new ApiError(
				"Failed to find challenges with such filters!",
				HttpCode.NOT_FOUND
			)
		)
	}
}

export default GetChallengeDetails
