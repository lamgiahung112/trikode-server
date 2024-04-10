import {
	GetSubmissionDetailsHandler,
	GetUserSubmissionHandler,
} from "@src/apis/submissions"
import { AuthenticationHandler } from "@src/middlewares"
import express from "express"

const submissionRouter = express.Router()

submissionRouter.get("/", AuthenticationHandler, GetUserSubmissionHandler)
submissionRouter.get("/details", AuthenticationHandler, GetSubmissionDetailsHandler)

export default submissionRouter
