const { ActivityType, Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    execute(bot) {
        const pack = require('../../../package.json')

        console.log('\x1b[33m' + 'Connectés à ' + '\x1b[35m' + `${bot.user.username}` + '\x1b[33m' + ' !\n' + '\x1b[33m' + '-> Le bot est utilisé sur ' + '\x1b[35m' + `${bot.guilds.cache.size}` + '\x1b[33m' + ' serveurs pour un total de ' + '\x1b[35m' + `${bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}` + '\x1b[33m' + ' membres !\n' + '\x1b[33m' + '-> Version Discord.js : ' + '\x1b[35m' + `${pack.dependencies['discord.js'].toString().replace("^", "").trim()}` + '\x1b[33m' + ' !')

        bot.user.setPresence({
            activities: [{ name: bot.config.clients.activity, type: ActivityType.Watching }],
            status: 'dnd',
        });
    }
}