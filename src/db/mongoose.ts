// Import mongoose
import mongoose, { Schema, Document, Mongoose, Types } from "mongoose"

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
	challengeDetails: Types.ObjectId,
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
	userId: Types.ObjectId,
	challengeId: Types.ObjectId,
	isPassed: Boolean,
	isPending: Boolean,
	error: String,
	code: String,
	testcasePassedCount: Number,
	totalTestCases: Number,
	result: Array<TestCaseResult>,
	createdAt: Number,
})

const UserChallengeProgressSchema: Schema = new Schema({
	challengeId: Types.ObjectId,
	userId: Types.ObjectId,
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
