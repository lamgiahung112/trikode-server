declare namespace Request {
	declare type SignUp = {
		name: string
		excerpt: string
		password: string
		email: string // Unique
		nickname: string
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
		exampleTestCases: { imageUrl?: string; input: string; expectedOutput: string }[]
		constraints: string[]
		testcases: { input: string; expectedOutput: string }[]
	}

	declare type UpdateChallengeRequest = {
		_id: string
		title: string
		difficulty: Difficulty
		tags: Tag[]
		description: string
		predefinedCode: string
		exampleTestCases: {
			imageUrl?: string
			input: string
			expectedOutput: string
		}[]
		constraints: string[]
		testcases: {
			_id?: string
			problemId?: string
			input: string
			expectedOutput: string
		}[]
	}
}
