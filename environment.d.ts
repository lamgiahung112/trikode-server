declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWT_SECRET: string
			JWT_EXPIRES: string
			AMQP_URL: string
			AMQP_RUN_QUEUE_KEY: string
			AMQP_RUN_RESULT_QUEUE_KEY: string
			AMQP_SAVE_QUEUE_KEY: string
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
