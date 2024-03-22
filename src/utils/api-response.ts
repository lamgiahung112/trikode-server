class ApiResponse {
	isSuccess: boolean
	message: string
	payload: any

	constructor() {
		this.isSuccess = true
		this.message = ""
		this.payload = null
	}

	setSuccess(success: boolean) {
		this.isSuccess = success
	}
	setMessage(message: string) {
		this.message = message
	}
	setPayload(payload: any) {
		this.payload = payload
	}

	static builder() {
		return new _ApiResponseBuilder()
	}
}

class _ApiResponseBuilder {
	_res: ApiResponse

	constructor() {
		this._res = new ApiResponse()
	}

	message(msg: string) {
		this._res.setMessage(msg)
		return this
	}

	isSuccess(scs: boolean) {
		this._res.setSuccess(scs)
		return this
	}

	payload(pl: any) {
		this._res.setPayload(pl)
		return this
	}

	build() {
		return this._res
	}
}

export default ApiResponse
