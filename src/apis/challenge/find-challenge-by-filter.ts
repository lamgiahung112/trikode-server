import { ChallengeModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { NextFunction, Request, Response } from "express"

const FindChallengeByFilterHandler = async (
	req: Request<{}, {}, qs.ParsedQs, Record<string, any>>,
	res: Response,
	next: NextFunction
) => {
	try {
		const reqBody = req.query
		const authenticatedUser = res.locals.authenticatedUser as AuthenticatedUserInfo

		const query: {
			title: object
			difficulty: object
			tags?: object
			status?: object
		} = {
			title: {
				$regex: new RegExp(reqBody.title ?? "", "i"),
			},
			difficulty: {
				$regex: new RegExp(reqBody.difficulty ?? "", "i"),
			},
		}

		if (reqBody.tags && reqBody.tags.length > 0) {
			query.tags = {
				$all: reqBody.tags instanceof Array ? [...reqBody.tags] : [reqBody.tags],
			}
		}

		const queriedChallenges = await ChallengeModel
			// 	.aggregate([{
			// 		$lookup: {
			// 			from: 'userchallengeprogress', // Collection name of UserChallengeProgress model
			// 			localField: 'id',
			// 			foreignField: 'challengeId',
			// 			as: 'progress'
			// 		},
			// 		$match: {
			// 			'progress.userId': authenticatedUser.id,
			// 			'progress.status': query.status ?? ""
			// 		}
			// 	}])
			.find(query)
			.skip((reqBody.page - 1) * reqBody.pageSize)
			.limit(reqBody.pageSize)
			.exec()

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
