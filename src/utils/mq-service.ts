import amqplib from "amqplib"

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
		consumerChannel.assertQueue(process.env.AMQP_SAVE_RESULT_QUEUE_KEY)

		consumerChannel.consume(process.env.AMQP_RUN_RESULT_QUEUE_KEY, (msg) => {
			console.log(msg)
		})

		consumerChannel.consume(process.env.AMQP_SAVE_RESULT_QUEUE_KEY, (msg) => {
			console.log(msg)
		})

		this._publisherChannel = await this._mqInstance.createChannel()
	}
}

export default MqService
