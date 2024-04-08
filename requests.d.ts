declare namespace Request {
	declare type SignUp = {
		name: string
		excerpt: string
		password: string
		email: string // Unique
		nickname: string
	}

	declare type PagingRequest = {
		page: number
		pageSize: number
	}

	declare type SignIn = {
		nickname: string
		password: string
	}

	declare type SpecifiedUserOnlyRequest = {
		userId: string
	}

	declare type CreateChallengeRequest = {
		title: string
		difficulty: Difficulty
		tags: Tag[]
		description: string
		predefinedCode: string
		exampleTestCases: ExampleTestCase[]
		constraints: string[]
		testcases: TestCase[]
	}

	declare type SubmitChallengeCodeRequest = {
		challengeId: string
		code: string
	}

	declare type UpdateChallengeRequest = {
		_id: string
		title: string
		difficulty: Difficulty
		tags: Tag[]
		description: string
		predefinedCode: string
		exampleTestCases: ExampleTestCase[]
		constraints: string[]
		testcases: TestCase[]
	}

	declare type ChallengeFilterRequest = PagingRequest & {
		title?: string
		difficulty?: Difficulty
		tags?: Tag[]
		status?: UserChallengeProgressStatus
		page: number
		pageSize: number
	}

	declare type ChallengeDetailsRequest = {
		titleSlug: string
	}
}
