function colorless(title, desc, footer = "AntiP2W - Keeping Minecraft Clean"){
	let embed = new Discord.MessageEmbed().setColor(config.colors.colorless)

	if(title) embed.setTitle(title)
	if(desc) embed.setDescription(desc)
	embed.setFooter(footer);
	return embed;
}

module.exports.colorless = colorless;
