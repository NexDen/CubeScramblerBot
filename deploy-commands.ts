const { REST, Routes } = require('discord.js');
const config = require('./config-prod.json');
const fs = require('node:fs');
const util = require('util');
const commands = [];
const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith('.ts'));


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
	try {
		
		if (commands.length === 0) {
			console.log("Herhangi bir komut bulunamadı.");
			rest.put(Routes.applicationGuildCommands(config.clientId, config.scramble_guild_id), { body: [] })
			.then(() => console.log("Komutlar başarıyla temizlendi!"))
				.catch(console.error);
		}
		else {
			console.log(`${commands.length} tane komut yazılıyor.`)
			const data = await rest.put(
				Routes.applicationGuildCommands(config.clientId, config.scramble_guild_id),
				{ body: commands },
			);
			console.log(`${data.length} tane komut yazıldı.`)


		}
	} catch (error) {
		console.error(error);
	}
})();