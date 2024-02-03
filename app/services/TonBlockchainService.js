const { HttpClient, Api } = require('tonapi-sdk-js')


module.exports = class TonBlockchainService {
    LIMIT = 1000

    constructor(walletAddress, tonApiToken) {
        this.walletAddress = walletAddress
        this.tonApiToken = tonApiToken
        this.timestampLastTransaction = Math.floor(Date.now() / 1000)

        this.#makeClient()
    }

    #makeClient = () => {
        const httpClient = new HttpClient({
            baseUrl: 'https://tonapi.io/',
            baseApiParams: {
                headers: {
                    Authorization: `Bearer ${this.tonApiToken}`,
                    'Content-type': 'application/json'
                }
            }
        })

        this.client = new Api(httpClient)
    }

    getEvents = async (jetton) => {
        const transfers = []

        const response = await this.client.accounts.getAccountEvents(
            this.walletAddress,
            {
                start_date: this.timestampLastTransaction,
                limit: this.LIMIT
            }
        )

        const events = response.events

        this.timestampLastTransaction = events[0]?.timestamp ?? this.timestampLastTransaction

        for (let i = 0; i < events.length; i++) {
            const actions = events[i].actions

            for (let action of actions) {
                if (action.type === 'JettonTransfer' && action.JettonTransfer.jetton.symbol === jetton) {
                    transfers.push({
                        status: action.status,
                        value: action.simple_preview.value,
                    })
                }
            }
        }

        return transfers
    }
}