import mongoose from "mongoose"

export default async function connectDB() {
	mongoose
		.connect("mongodb://127.0.0.1:27017/trikode", {
			minPoolSize: 5,
			maxPoolSize: 10,
		})
		.then(() => {
			console.log("CONNECTED TO DB")
		})
}
