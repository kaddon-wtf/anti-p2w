// init .env
require("dotenv").config();

global.Discord = require("discord.js");
const client = new Discord.Client();
global.fs = require("fs");
global.path = require("path");
const EventEmitter = require('events')
const WOKCommands = require('wokcommands')
global.axios = require("axios").default;
global.config = require(path.join(__dirname, "files", "config.json"));
global.Embed = require(path.join(__dirname, "Embed.js"));

client.on("ready", () => {
	new WOKCommands(client, {
        // The name of the local folder for your command files
        commandsDir: 'modules',

        // The name of the local folder for your feature files
        featuresDir: 'events',

        // If WOKCommands warning should be shown or not, default true
        showWarns: true,

		// disable defaults
        disabledDefaultCommands: [
            'help',
            'command',
            'language',
            'prefix',
            'requiredrole'
        ]
    })
    .setDefaultPrefix('p2w ')

	console.clear();
	console.log("AntiP2W bot online.")
});

// Init verification event
global.Verify = new EventEmitter()
require(path.join(__dirname, "events", "VerifySuccess"));

client.login(process.env.TOKEN);
