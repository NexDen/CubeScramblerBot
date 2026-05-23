const client = global.client
var colors = require("../utilities/colors.js")
var config = global.config

async function handle_commands(interaction) {
    if (!interaction.isChatInputCommand()) return 

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
        console.error(`${colors.Bright}${colors.FgRed}[KOMUT BULUNAMADI]${colors.Reset} ${interaction.commandName}`)
    }

    try {
        await command.execute(interaction)
    } catch (err){
        console.error(err)
        await interaction.reply({
            content: "Komut çalıştırırken bir hata oluştu.",
            ephemeral: true
        })
    }
}

module.exports = {
    handle_commands
}