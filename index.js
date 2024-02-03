require('dotenv').config()
const TonBlockchainService = require('./app/services/TonBlockchainService')
const Server = require('./app/Server')


const walletAddress = process.env.WALLET_ADDRESS
const tonApiToken = process.env.TON_API_TOKEN
const tonBlockchainService = new TonBlockchainService(walletAddress, tonApiToken)
new Server(tonBlockchainService)
