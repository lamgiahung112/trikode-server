import express from "express"
import {
	CreateChallengeHandler,
	FindChallengeByFilterHandler,
	UpdateChallengeHandler,
} from "@src/apis/challenge"
import { AuthenticationHandler } from "@src/middlewares"

const challengeRouter = express.Router()

challengeRouter.use(AuthenticationHandler)

challengeRouter.post("/", CreateChallengeHandler)
challengeRouter.put("/", UpdateChallengeHandler)
challengeRouter.get("/", FindChallengeByFilterHandler)

export default challengeRouter
