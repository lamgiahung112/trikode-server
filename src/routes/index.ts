import { Application } from "express"
import authRouter from "./auth-routes"
import challengeRouter from "./challenge-routes"

export default function initRoute(app: Application) {
	app.use("/api/auth", authRouter)
	app.use("/api/challenge", challengeRouter)
}
