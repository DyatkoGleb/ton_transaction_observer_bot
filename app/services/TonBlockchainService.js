const { HttpClient, Api } = require('tonapi-sdk-js')


module.exports = class TonBlockchainService {
    constructor(walletAddress, tonApiToken) {
        this.walletAddress = walletAddress
        this.tonApiToken = tonApiToken

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
        const limit = 10

        const response = await this.client.accounts.getAccountEvents(this.walletAddress, { limit });

        const events = response.events

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