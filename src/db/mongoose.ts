// Import mongoose
import mongoose, { Schema, Document, Mongoose } from "mongoose"

// Define interface for mongoose documents
interface IUser extends User, Document {}

interface IChallenge extends Challenge, Document {}

interface IChallengeDetails extends ChallengeDetails, Document {}

interface IChallengeSubmission extends ChallengeSubmission, Document {}

interface IUserChallengeProgress extends UserChallengeProgress, Document {}

// Define mongoose schemas
const UserSchema: Schema = new Schema({
	name: String,
	excerpt: String,
	password: String,
	email: { type: String, unique: true },
	nickname: { type: String, unique: true },
	role: String,
})

const ChallengeSchema: Schema = new Schema({
	id: String,
	title: { type: String, unique: true },
	difficulty: String,
	tags: [String],
	challengeDetails: String,
	createdAt: Number,
	submissionCount: Number,
	acceptanceCount: Number,
	likeCount: Number,
})

const ChallengeDetailsSchema: Schema = new Schema({
	id: String,
	description: String,
	predefinedCode: String,
	exampleTestCases: [{ imageUrl: String, input: String, expectedOutput: String }],
	constraints: [String],
})

const ChallengeSubmissionSchema: Schema = new Schema({
	userId: String,
	problemId: String,
	code: String,
	runtime: Number,
	testcasePassedCount: Number,
	createdAt: Number,
	status: String,
})

const UserChallengeProgressSchema: Schema = new Schema({
	challengeId: String,
	userId: String,
	status: String,
	isLiked: Boolean,
})

// Create mongoose models
const UserModel = mongoose.model<IUser>("User", UserSchema)
const ChallengeModel = mongoose.model<IChallenge>("Challenge", ChallengeSchema)
const ChallengeDetailsModel = mongoose.model<IChallengeDetails>(
	"ChallengeDetails",
	ChallengeDetailsSchema
)
const ChallengeSubmissionModel = mongoose.model<IChallengeSubmission>(
	"ChallengeSubmission",
	ChallengeSubmissionSchema
)
const UserChallengeProgressModel = mongoose.model<IUserChallengeProgress>(
	"UserChallengeProgress",
	UserChallengeProgressSchema
)

export {
	UserModel,
	ChallengeModel,
	ChallengeDetailsModel,
	ChallengeSubmissionModel,
	UserChallengeProgressModel,
}
