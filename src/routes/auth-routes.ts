import express from "express"
import { SignUpHandler, SignInHandler, VerifyHandler } from "@src/apis/auth"
import { AuthenticationHandler } from "@src/middlewares"

const authRouter = express.Router()

authRouter.post("/signin", SignInHandler)
authRouter.post("/signup", SignUpHandler)
authRouter.get("/verify", AuthenticationHandler, VerifyHandler)

export default authRouter
