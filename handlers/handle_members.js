const client = global.client
var colors = require("../utilities/colors.js")
var config = global.config

async function handle_member_add(interaction) {
    await interaction.deferUpdate()
    return console.log(`${colors.warningText("UYARI")} /handlers/handle_member.js dosyası implement edilmedi!`);
}

async function handle_member_leave(interaction) {
    await interaction.deferUpdate()
    return console.log(`${colors.warningText("UYARI")} /handlers/handle_member.js dosyası implement edilmedi!`);
}

module.exports = {
    handle_member_add,
    handle_member_leave,
}