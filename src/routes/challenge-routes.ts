import express from "express"
import {
	CreateChallengeHandler,
	FindChallengeByFilterHandler,
	UpdateChallengeHandler,
} from "@src/apis/challenge"
import { AuthenticationHandler, WeakAuthenticationHandler } from "@src/middlewares"

const challengeRouter = express.Router()

challengeRouter.get("/", WeakAuthenticationHandler, FindChallengeByFilterHandler)
challengeRouter.post("/", AuthenticationHandler, CreateChallengeHandler)
challengeRouter.put("/", AuthenticationHandler, UpdateChallengeHandler)

export default challengeRouter
