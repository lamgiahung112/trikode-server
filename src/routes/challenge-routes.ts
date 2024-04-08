import express from "express"
import {
	CreateChallengeHandler,
	FindChallengeByFilterHandler,
	GetChallengeDetails,
	SubmitChallengeCodeHandler,
	UpdateChallengeHandler,
} from "@src/apis/challenge"
import { AuthenticationHandler, WeakAuthenticationHandler } from "@src/middlewares"

const challengeRouter = express.Router()

challengeRouter.post("/submit", AuthenticationHandler, SubmitChallengeCodeHandler)
challengeRouter.get("/", WeakAuthenticationHandler, FindChallengeByFilterHandler)
challengeRouter.post("/", AuthenticationHandler, CreateChallengeHandler)
challengeRouter.put("/", AuthenticationHandler, UpdateChallengeHandler)
challengeRouter.get("/details", WeakAuthenticationHandler, GetChallengeDetails)

export default challengeRouter
