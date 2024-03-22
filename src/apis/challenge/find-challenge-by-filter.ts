import { ChallengeModel } from "@src/db/mongoose"
import ApiError from "@src/utils/api-error"
import HttpCode from "@src/utils/http-code"
import { NextFunction, Request, Response } from "express"

const FindChallengeByFilterHandler = async (
	req: Request<{}, {}, {}, Request.ChallengeFilterRequest>,
	res: Response,
	next: NextFunction
) => {
	try {
		const reqBody = req.query

		const query = {
			title: {
				$regex: new RegExp(reqBody.title ?? "", "i"),
			},
			difficulty: {
				$regex: new RegExp(reqBody.difficulty ?? "", "i"),
			},
		}

		if (reqBody.tags && reqBody.tags.length > 0) {
			Object.defineProperty(query, "tags", {
				value: {
					$all: [...reqBody.tags],
				},
			})
		}

		const queriedChallenges = await ChallengeModel.find(query)
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
