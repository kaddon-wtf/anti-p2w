Verify.on("success", async (message, qlutch) => {
	// get variables
	const {member, author, guild} = message;
	const {user_id, highestRole, ip} = qlutch.qlutch;

	// get role mappings
	const roles = require(path.join(__dirname, "..", "files", "roles.json"));

	// add roles
	try{
		let role = guild.roles.cache.find(role => role.id === roles[highestRole]);
		if(role) await member.roles.add(role, `Verified buyer`);
	} catch(err){
		return console.log("Role error ", err);
	}

	// log stuff
	let embedLog = new Discord.MessageEmbed().setColor("#aef2aa")
	.setAuthor(`${member.user.username}`, `https://minecraftforceop.com/forums/data/avatars/l/0/${user_id}.jpg`);

	// add description
	let description = [
		`tag: ${member}`,
		`id: \`${member.user.id}\``,
		`uid: \`${user_id}\``,
		`ip: \`${ip}\``,
	]
	embedLog.setDescription(description.join("\n"));
	// add forums profile
	embedLog.addField("Forums Profile", `[Click here](https://minecraftforceop.com/forums/members/${user_id})`);

	// get log channel
	let log = guild.channels.cache.get("858833476945444886");
	// send the log
	log.send(embedLog);

	// send success
	author.send(`Successfully verified as a **${highestRole}** user.`)


});
