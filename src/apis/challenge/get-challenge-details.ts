import { ChallengeModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { NextFunction, Request, Response } from "express"
import { PipelineStage, Types } from "mongoose"

const GetChallengeDetails = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const reqBody = req.query as Request.ChallengeDetailsRequest
		const authenticatedUser = res.locals.authenticatedUser as AuthenticatedUserInfo

		const titleMatch: PipelineStage = {
			$match: {
				title: {
					$regex: new RegExp(reqBody.titleSlug, "i"),
				},
			},
		}
		const joinDetail: PipelineStage = {
			$lookup: {
				from: "challengedetails",
				localField: "challengeDetails",
				foreignField: "_id",
				as: "details",
			},
		}
		const findOne: PipelineStage = {
			$limit: 1,
		}
		const joinUserProgress: PipelineStage = {
			$lookup: {
				from: "userchallengeprogresses",
				let: { challengeId: "$_id" },
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ["$challengeId", "$$challengeId"] },
									{
										$eq: [
											"$userId",
											authenticatedUser
												? Types.ObjectId.createFromHexString(
														authenticatedUser.id
												  )
												: "",
										],
									},
								],
							},
						},
					},
				],
				as: "progress",
			},
		}

		const projector: PipelineStage = {
			$project: {
				title: 1,
				difficulty: 1,
				tags: 1,
				submissionCount: 1,
				acceptanceCount: 1,
				likeCount: 1,
				details: { $arrayElemAt: ["$details", 0] },
				status: { $arrayElemAt: ["$progress.status", 0] },
			},
		}

		const aggs: PipelineStage[] = [
			titleMatch,
			joinDetail,
			findOne,
			joinUserProgress,
			projector,
		]
		const queriedChallenges = await ChallengeModel.aggregate(aggs).exec()

		if (queriedChallenges.length === 0) {
			throw new Error()
		}

		res.locals = {
			payload: queriedChallenges[0],
		}
		next()
	} catch {
		next(new ApiError("Failed to find this challenge!", HttpCode.NOT_FOUND))
	}
}

export default GetChallengeDetails
