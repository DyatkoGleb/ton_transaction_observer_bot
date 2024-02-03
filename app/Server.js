const express = require('express')
const bodyParser = require('body-parser')


module.exports = class Server
{
    constructor (tonBlockchainService) {
        this.tonBlockchainService = tonBlockchainService
        this.app = express()

        this.app.use(bodyParser.json())

        this.startServer()

        setInterval(() =>
            this.tonBlockchainService.getEvents('GRAM').then(data => console.log(data))
        ,2000)
    }

    startServer = () => {
        const port = process.env.PORT || 2222

        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    }
}
