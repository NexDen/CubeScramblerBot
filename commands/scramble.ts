const { SlashCommandBuilder } = require("discord.js")
import type { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js"
const scrambler = require("../utilities/scramblers/3x3x3.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("scramble")
        .setDescription("Karıştırma oluşturur.")
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName("cube_type")
                .setDescription("Küp türü")
                .setChoices(
                    { name: "3x3", value: "3" },
                    { name: "2x2", value: "2" },
                    { name: "4x4", value: "4" },
                    { name: "5x5", value: "5" },
                    { name: "6x6", value: "6" },
                    { name: "7x7", value: "7" },
                    { name: "Clock", value: "clock" },
                    { name: "Megaminx", value: "megaminx" },
                    { name: "Pyraminx", value: "pyraminx" },
                    { name: "Skewb", value: "skewb" },
                    { name: "Square-1", value: "sq1" },
                )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const cubeType = interaction.options.getString("cube_type") ?? "3"

        await interaction.reply(scrambler.getRandomScramble())
    }
}
