import express from "express"
import { CreateChallengeHandler, UpdateChallengeHandler } from "@src/apis/challenge"
import { AuthenticationHandler } from "@src/middlewares"

const challengeRouter = express.Router()

challengeRouter.use(AuthenticationHandler)

challengeRouter.post("/", CreateChallengeHandler)
challengeRouter.put("/", UpdateChallengeHandler)

export default challengeRouter
