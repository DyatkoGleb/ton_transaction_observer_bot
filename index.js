require('dotenv').config()
const { HttpClient, Api } = require('tonapi-sdk-js');

const walletAddress = process.env.WALLET_ADDRESS
const tonApiToken = process.env.TON_API_TOKEN

const httpClient = new HttpClient({
    baseUrl: 'https://tonapi.io/',
    baseApiParams: {
        headers: {
            Authorization: `Bearer ${tonApiToken}`,
            'Content-type': 'application/json'
        }
    }
})

const client = new Api(httpClient)

const getEvents = async (jetton) => {
    const transfers = []
    const limit = 10
    const response = await client.accounts.getAccountEvents(walletAddress, { limit });

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

    console.log(transfers)
}

getEvents('GRAM')
