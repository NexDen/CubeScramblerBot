const client = global.client
var colors = require("../utilities/colors.js")
var config = global.config

var { message_log } = require("../utilities/message_logger.js")

async function handle_messages(message) {
    message_log(message)
}

module.exports = {
    handle_messages
}