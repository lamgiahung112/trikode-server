import express from "express"
import connectDB from "./db/connect"
import initRoute from "./routes"
import { ResponseHandler, ErrorHandler } from "./middlewares"
import dotenv from "dotenv"
import cors from "cors"
import fs from "fs"

const app = express()
const port = 3001

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initRoute(app)

app.use(ResponseHandler)
app.use(ErrorHandler)

connectDB()
	.then(() => {
		app.listen(port, () => {
			console.log("LISTENING ON PORT 3001")
		})
		fs.mkdirSync("./tests")
	})
	.catch(console.log)
