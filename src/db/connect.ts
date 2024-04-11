import mongoose from "mongoose"

export default async function connectDB() {
	mongoose
		.connect(process.env.MONGODB_URL, {
			minPoolSize: 5,
			maxPoolSize: 10,
		})
		.then(() => {
			console.log("CONNECTED TO DB")
		})
}
