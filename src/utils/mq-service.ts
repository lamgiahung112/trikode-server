import { ChallengeModel, ChallengeSubmissionModel } from "@src/db/mongoose"
import amqplib from "amqplib"

type RunResultMessage = {
	challengeId: string
	userId: string
	isPassed: boolean
	err: string
	result: TestCaseResult[]
}

class MqService {
	static _mqInstance: amqplib.Connection
	static _publisherChannel: amqplib.Channel

	static async init() {
		if (this._mqInstance || !process.env.AMQP_URL) {
			return
		}
		this._mqInstance = await amqplib.connect(process.env.AMQP_URL)

		const consumerChannel = await this._mqInstance.createChannel()
		consumerChannel.assertQueue(process.env.AMQP_RUN_RESULT_QUEUE_KEY)

		consumerChannel.consume(process.env.AMQP_RUN_RESULT_QUEUE_KEY, async (msg) => {
			const submissionData = JSON.parse(
				msg!.content.toString()
			) as ChallengeSubmission

			const submission = new ChallengeSubmissionModel({
				...submissionData,
			})
			const challenge = await ChallengeModel.findById(submissionData.challengeId)
			challenge?.set("submissionCount", challenge.submissionCount + 1)
			challenge?.set(
				"acceptanceCount",
				challenge.acceptanceCount + (submissionData.isPassed ? 1 : 0)
			)
			await challenge?.save()
			await submission.save()
			consumerChannel.ack(msg!)
		})

		this._publisherChannel = await this._mqInstance.createChannel()
	}

	static sendSaveTestCaseMessage(data: { challengeId: string; testcases: TestCase[] }) {
		this._publisherChannel.sendToQueue(
			process.env.AMQP_SAVE_QUEUE_KEY,
			Buffer.from(JSON.stringify(data))
		)
	}
}

export default MqService
