const client = global.client
var colors = require("../utilities/colors.js")
var config = global.config

async function handle_modals(interaction) {
    await interaction.deferUpdate()
    return console.log(`${colors.warningText("UYARI")} /handlers/handle_modals.js dosyası implement edilmedi!`);
}

module.exports = {
    handle_modals
}