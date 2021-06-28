const axios = require("axios").default;

module.exports = {
    // Best practice for the built-in help menu
    category: 'Qlutch',
	description: "Verify with Qlutch",
	cooldown: '10s',
    // Invoked when the command is actually ran
    callback: async ({ message, args }) => {

		let embed = Embed.colorless("AntiP2W Verification", "\`\`\`Please enter your IP below to verify\`\`\`")
		embed.addField("Sketched out?", `Qlutch uses IPs to auth, maybe we will switch to Web based verification in the future. Until then, here's my source code --> [https://github.com/kaddon-wtf/anti-p2w](click)`)

		message.author.send(embed).then(async msg => {

			let times = new Map();

			let collectr = collect(message.author.id);
			// listen for it to collect
			collectr.on('collect', async m => {
				let valid = await validateIP(m.content);
				if(!valid){

					// get their amount of times
					let amnt = times.get(message.author.id);
					// if there's an amount, update it and increment
					if(amnt) {
						times.set(message.author.id, amnt + 1)
						amnt++;
					// if there's not an amount, set it
					} else {
						times.set(message.author.id, 1);
						amnt = 1;
					}

					// if they've failed three times
					if(amnt == 3){
						msg.channel.send(`You've entered an invalid IP three times, please rerun the verification command.`);
						return collectr.stop("Failed");
					}

					// if it gets to here, they haven't failed three times yet
					msg.channel.send(`You've entered an invalid IP, please enter a valid one.`);
					return

				}

				// check against qlutch API

				checkQlutch(m.content).then(res => {
					// if there's a successful response, call the success event
					return Verify.emit('success', message, res);
				}).catch(err => {
					// if success is false, and the error is "Not authorized"
					if(err.success == false && err.error == "Not authorized"){
						// send an embed saying they're not authorized.
						let embed = new Discord.MessageEmbed().setColor(config.colors.colorless).setAuthor("Pay2W Verification")
						.setDescription("Your IP does not seem be authorized with Qlutch :c");
						return msg.channel.send(embed);
					} else {
						// error is not a auth error, send the error.
						let embed = Embed.colorless("AntiP2W Verification | Error", `\`\`\`${err}\`\`\``);
						return msg.channel.send(embed);
					}
				})


			});
		});


		// collect function
		function collect(id){
			// message collector stuffs
			// init a filter, this would only allow the author to chat
			const filter = m =>	m.author.id == id;
			// init collector
			let dm = message.author.dmChannel
			const collector = dm.createMessageCollector(filter, { time: 60000 });
			// return that collector
			return collector;
		}

		// validate function
		function validateIP(ip){
			return new Promise((resolve) => {
				if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip) == false) {
					resolve(false)
				}
				resolve(true)
			})
		}

		// check qlutch status
		function checkQlutch(IP){
			return new Promise((resolve, reject) => {
				axios
				.get(`${process.env.API_URL}${IP}`)
				.then(function(response) {
					// shorten qlutch obj
					let qlutch = response.data;
					// if no response data, they're not authorized
					if(!qlutch) reject({ success: false, error: "Not authorized"})
					// if success is false, and there's an error that says Not authorized, return they're not authorized
					if (qlutch.success == false && qlutch.error == "Not authorized") reject({ success: false, error: "Not authorized"});

					// if they exist
					if (qlutch.user_id && qlutch.success == true) {
						// assume they have lite
						qlutch.hasLite = true;

						// get their highest role
						if (qlutch.hasLite) highestRole = "lite";
						if (qlutch.hasPremium) highestRole = "premium";
						if (qlutch.hasConsole) highestRole = "console";
						qlutch.highestRole = highestRole;

						// add censored ip to the qlutch obj for simplicity
						let temp = IP.split(".")
						temp.pop();
						temp.pop();
						let censoredIP = temp.join(".")+".*.*";
						qlutch.ip = censoredIP;

						resolve({success: true, qlutch});
					}
				// if there's a website error
				}).catch(err => {
					// reject that error
					reject(err);
				})
			})

		}

	}
}
