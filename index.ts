var colors = require("./utilities/colors.ts")

const debug = false;

// initial running setup
try {
    try {
        if (debug) {
            var config = require("./config-test.json")
        } else {
            var config = require("./config-prod.json")
        }
    } catch (err) {
        console.error(`${colors.errorText("HATA")} config.json dosyası bulunamadı!`)
        process.exit(1)
    }
    if (debug) {
        var config = require("./config-test.json")
    } else {
        var config = require("./config-prod.json")
    }
    global.config = config
} catch (err) {
    console.error(`${colors.errorText("HATA")} Geçersiz token!`)
    process.exit(1)
}

const fs = require("node:fs")
const path = require("node:path")

if (!fs.existsSync("./commands")) {
    console.error(`${colors.warningText("UYARI")} ./commands klasörü bulunamadı, oluşturuluyor.`)
    fs.mkdirSync("./commands")
}

import { Client, Collection, GatewayIntentBits, ActivityType, Events, EmbedBuilder } from "discord.js";



const client = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
})

const cron = require("node-cron")

const scrambler = require("./utilities/scramble_handler.ts")

client.once(Events.ClientReady, async (readyClient: Client) => { 
    console.log(`  
:::     ::: ::::    ::: :::::::::: :::    ::: 
:+:     :+: :+:+:   :+: :+:        :+:    :+: 
+:+     +:+ :+:+:+  +:+ +:+         +:+  +:+  
+#+     +:+ +#+ +:+ +#+ +#++:++#     +#++:+   
 +#+   +#+  +#+  +#+#+# +#+         +#+  +#+  
  #+#+#+#   #+#   #+#+# #+#        #+#    #+# 
    ###     ###    #### ########## ###    ###  
    `)
    
    if (debug) {
        console.log(`${colors.Bright}${colors.FgGreen}TEST MODE${colors.Reset}`)
    } else {
        console.log(`${colors.Bright}${colors.FgRed}PROD MODE${colors.Reset}`)
    }

    console.log(`${colors.Bright}Connected to ${colors.Reset}${colors.FgYellow}${readyClient.user?.tag}!${colors.Reset}`)
    client.user?.setActivity({
        type: ActivityType.Custom,
        name: "küp scramble yapıyo",
        state: config.activityName
    })


    

    cron.schedule("20 19 * * *", async () => {

        var newScramble = scrambler.getScramble(3);
        var messageGuild = client.guilds.cache.find(guild => guild.id === config.daily_scramble_guild_id)
        console.log(messageGuild?.name)
        var messageChannel = messageGuild?.channels.cache.find(channel => channel.id === config.scramble_channel_id)
        console.log(messageChannel?.name)

        var embed = new EmbedBuilder()
            .setTitle("Günün Karıştırması!")
            .setDescription(newScramble)
            .setColor("#1f1e33")
            .setFooter({text: "zamanlarınızı atın!"})
        
        if (messageChannel?.isSendable()) {
            await messageChannel.send({embeds: [embed]});
        }
        
    })


});


client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

if (commandFiles.length === 0) {
    console.log(`${colors.warningText("UYARI")} Herhangi bir komut bulunamadı!`);
}
else {
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if (!("execute" in command)){
            console.log(`${colors.warningText("UYARI")} ${filePath} dosyasında "execute()" fonksiyonu bulunamadı!`);
        }
        if (!("data" in command)){
            console.log(`${colors.warningText("UYARI")} ${filePath} dosyasında "data" alanı bulunamadı!`);
        }
        client.commands.set(command.data.name, command);
    }
}

client.on("error", error => {
    console.error(`${colors.errorText("HATA")} ${error}`)
})

const { edit_log } = require("./utilities/message_logger.js")

const { handle_string_select_menu, handle_role_select_menu, handle_mentionable_select_menu, handle_channel_select_menu } = require("./handlers/handle_select_menus.js")

const { handle_modals } = require("./handlers/handle_modals.js")

const { handle_buttons } = require("./handlers/handle_buttons.js")

const { handle_commands } = require("./handlers/handle_commands.js")

const { handle_member_add, handle_member_leave } = require("./handlers/handle_members.js")

const { handle_ctx_menus } = require("./handlers/handle_ctx_menus.js")

const { handle_messages } = require("./handlers/handle_messages.js")


client.on("interactionCreate", async interaction => {
    // console.log(interaction)
    
    if (interaction.isStringSelectMenu()) handle_string_select_menu(interaction)
    
    else if (interaction.isModalSubmit()) handle_modals(interaction)

    else if (interaction.isButton()) handle_buttons(interaction)
    
    if (interaction.isAnySelectMenu()){
        if (interaction.isRoleSelectMenu()) handle_role_select_menu(interaction)
        else if (interaction.isUserSelectMenu()) handle_mentionable_select_menu(interaction)
        else if (interaction.isChannelSelectMenu()) handle_channel_select_menu(interaction)
        else if (interaction.isMentionableSelectMenu()) handle_mentionable_select_menu(interaction)
    }
    else if (interaction.isContextMenuCommand()) handle_ctx_menus(interaction)

    else if (interaction.isChatInputCommand()) handle_commands(interaction)
})

client.on("guildCreate", async guild => {
    var now = new Date(Date.now()).toLocaleTimeString("tr-TR")
    var guild_name = guild.name
    console.log(`${colors.infoText("SUNUCUYA GİRİŞ")} ${colors.FgYellow}${now} ${colors.FgGreen}${guild_name}`)
})

client.on("guildMemberAdd", async member => {
    handle_member_add(member)
})

client.on("guildMemberRemove", async member => {
    handle_member_leave(member)
})

client.on("messageCreate", async message =>{
    //handle_messages(message)
})

client.on("messageUpdate", async (oldMessage, newMessage) =>{
    edit_log(oldMessage, newMessage)
})

client.login(config.token)