const { Client, IntentsBitField } = require("discord.js");
const bot = new Client({ intents: new IntentsBitField(3276799) });


bot.config = require('./config');


require('./src/Structure/Handler/Event')(bot);
require('./src/Structure/Handler/Command')(bot);
require('./src/Structure/Mysql/mysql')(bot);
require('./src/Structure/AntiCrash/anticrash')(bot);


bot.login(bot.config.clients.token);