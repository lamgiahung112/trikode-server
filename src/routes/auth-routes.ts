import express from "express"
import { SignUpHandler, SignInHandler } from "@src/apis/auth"
import { AuthenticationHandler } from "@src/middlewares"

const authRouter = express.Router()

authRouter.post("/signin", SignInHandler)
authRouter.post("/signup", SignUpHandler)
authRouter.get("/test-auth", AuthenticationHandler)

export default authRouter
