var colors = require("../utilities/colors.js")
var config = global.config

async function handle_buttons(interaction) {
    await interaction.deferUpdate()
    return console.log(`${colors.warningText("UYARI")} /handlers/handle_buttons.js dosyası implement edilmedi!`);
}

module.exports = {
    handle_buttons
}