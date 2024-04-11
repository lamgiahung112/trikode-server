import { ChallengeModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { NextFunction, Request, Response } from "express"
import { PipelineStage, Types } from "mongoose"

const FindChallengeByFilterHandler = async (
	req: Request<{}, {}, qs.ParsedQs, Record<string, any>>,
	res: Response,
	next: NextFunction
) => {
	try {
		const reqBody = req.query as Request.ChallengeFilterRequest
		const authenticatedUser = res.locals.authenticatedUser as AuthenticatedUserInfo
		const aggs: PipelineStage[] = []

		if (authenticatedUser) {
			aggs.push({
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
												Types.ObjectId.createFromHexString(
													authenticatedUser.id
												),
											],
										},
									],
								},
							},
						},
					],
					as: "progress",
				},
			})

			if (reqBody.status)
				aggs.push({
					$match: {
						"progress.status": reqBody.status,
					},
				})
		}

		aggs.push({
			$project: {
				title: 1,
				difficulty: 1,
				tags: 1,
				submissionCount: 1,
				acceptanceCount: 1,
				likeCount: 1,
				status: { $arrayElemAt: ["$progress.status", 0] },
			},
		})

		aggs.push({
			$match: {
				title: {
					$regex: new RegExp(reqBody.title ?? "", "i"),
				},
				difficulty: {
					$regex: new RegExp(reqBody.difficulty ?? "", "i"),
				},
			},
		})

		if (reqBody.tags && reqBody.tags.length > 0) {
			aggs.push({
				$match: {
					tags: {
						$all:
							reqBody.tags instanceof Array ? reqBody.tags : [reqBody.tags],
					},
				},
			})
		}

		aggs.push({
			$skip: (+reqBody.page - 1) * (+reqBody.pageSize + 0),
		})

		aggs.push({
			$limit: +reqBody.pageSize,
		})
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

export default FindChallengeByFilterHandler
