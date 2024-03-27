declare type User = {
	name: string
	excerpt: string
	password: string
	email: string // Unique
	nickname: string
	role: "USER" | "ADMIN"
}

declare type Difficulty = "EASY" | "MEDIUM" | "HARD"
declare type Tag = "SLIDING_WINDOW" | "MATH" | "DYNAMIC_PROGRAMMING" | "ARRAY" | "STRING"

declare type TestCase = {
	input: string
	expectedOutput: string
}

declare type ExampleTestCase = TestCase & {
	imageUrl?: string
}

declare type ChallengeDetails = {
	description: string
	predefinedCode: string
	exampleTestCases: ExampleTestCase[]
	constraints: string[]
}

declare type Challenge = {
	title: string
	difficulty: Difficulty
	tags: Tag[]
	challengeDetails: string
	createdAt: number // long
	submissionCount: number
	acceptanceCount: number
	likeCount: number
}

declare type ChallengeSubmissionStatus =
	| "PENDING"
	| "WRONG_ANSWER"
	| "TIMEOUT"
	| "ACCEPTED"

declare type ChallengeSubmission = {
	userId: string
	problemId: string
	code: string
	runtime: number
	testcasePassedCount: number
	createdAt: number
	status: ChallengeSubmissionStatus
}

declare type UserChallengeProgressStatus = "NONE" | "ATTEMPTED" | "SOLVED"
declare type UserChallengeProgress = {
	challengeId: string
	userId: string
	status: UserChallengeProgressStatus
	isLiked: boolean
}

declare type AuthenticatedUserInfo = Omit<User, "password" | "excerpt"> & {
	id: string
	iat: number
	exp: number
}
