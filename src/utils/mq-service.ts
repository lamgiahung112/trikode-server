import { ChallengeModel, ChallengeSubmissionModel } from "@src/db/mongoose"
import amqplib from "amqplib"

type SubmissionResultMessage = Omit<ChallengeSubmission, "userId" | "code"> & {
	submissionId: string
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
			console.log(msg?.content.toString())
			const submissionData = JSON.parse(
				msg!.content.toString()
			) as SubmissionResultMessage

			const submission = await ChallengeSubmissionModel.findById(
				submissionData.submissionId
			)
			const challenge = await ChallengeModel.findById(submissionData.challengeId)
			challenge?.set("submissionCount", challenge.submissionCount + 1)
			challenge?.set(
				"acceptanceCount",
				challenge.acceptanceCount + (submissionData.isPassed ? 1 : 0)
			)
			submission?.set("isPending", false)
			submission?.set("result", submissionData.result)
			submission?.set("error", submissionData.error)
			submission?.set("isPassed", submissionData.isPassed)
			submission?.set("testcasePassedCount", submissionData.testcasePassedCount)
			submission?.set("totalTestCases", submission.totalTestCases)

			await challenge?.save()
			await submission?.save()
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

	static sendRunCodeMessage(data: {
		challengeId: string
		submissionId: string
		code: string
	}) {
		this._publisherChannel.sendToQueue(
			process.env.AMQP_RUN_QUEUE_KEY,
			Buffer.from(JSON.stringify(data))
		)
	}
}

export default MqService
