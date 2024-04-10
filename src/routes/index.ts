import { Application } from "express"
import authRouter from "./auth-routes"
import challengeRouter from "./challenge-routes"
import submissionRouter from "./submission-routes"

export default function initRoute(app: Application) {
	app.use("/api/auth", authRouter)
	app.use("/api/challenges", challengeRouter)
	app.use("/api/submissions", submissionRouter)
}
