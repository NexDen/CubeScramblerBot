const client = global.client
var colors = require("../utilities/colors.js")
var config = global.config

async function handle_select_menus(interaction) {
    await interaction.deferUpdate()
    return console.log(`${colors.warningText("UYARI")} /handlers/handle_select_menus.js dosyası implement edilmedi!`);
}

module.exports = {
    handle_select_menus
}