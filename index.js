require('dotenv').config()
const TelegramBotApi = require('node-telegram-bot-api')
const TonBlockchainService = require('./app/services/TonBlockchainService')
const Server = require('./app/Server')
const { message } = require('telegraf/filters')


const walletAddress = process.env.WALLET_ADDRESS
const tonApiToken = process.env.TON_API_TOKEN


const bot = new TelegramBotApi(process.env.TG_BOT_TOKEN, { polling: true })
const tonBlockchainService = new TonBlockchainService(walletAddress, tonApiToken)
new Server(tonBlockchainService, bot, process.env.CHAT_ID)

