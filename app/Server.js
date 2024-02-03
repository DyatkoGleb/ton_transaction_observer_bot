const express = require('express')
const bodyParser = require('body-parser')


module.exports = class Server
{
    constructor (tonBlockchainService, bot, chatId) {
        this.tonBlockchainService = tonBlockchainService
        this.chatId = chatId
        this.bot = bot
        this.app = express()

        this.app.use(bodyParser.json())

        this.startServer()

        this.startObserver()
    }

    startObserver = () => {
        setInterval(async () => {
            this.sendNewTransactions(await this.getNewTransactions())
        }, 2000)
    }

    getNewTransactions = async () => {
        return await this.tonBlockchainService.getEvents('GRAM')
    }

    sendNewTransactions = (transactions) => {
        if (transactions.length) {
            for (let transaction of transactions) {
                this.bot.sendMessage(this.chatId, (this.makeMessage(transaction)))
            }
        }
    }

    makeMessage = (transaction) => {
        return '#'
            + transaction.jettonName
            + '\n'
            + 'Received: '
            + transaction.value
    }

    startServer = () => {
        const port = process.env.PORT || 2222

        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    }
}
