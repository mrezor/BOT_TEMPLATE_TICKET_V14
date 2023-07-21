module.exports = (bot) => {
    const { EmbedBuilder } = require('discord.js');
    const process = require('process');

    const Embed = new EmbedBuilder()
    .setColor(bot.config.clients.embedColor)
    .setTimestamp()
    .setFooter({ text: bot.config.clients.name, iconURL: bot.config.clients.logo });

    process.on("unhandledRejection", (reason, p) => {
        console.log(reason, p)

        //const Channel = bot.channels.cache.get(`${bot.config.systeme.channelAntiCrash}`)

        //if (!Channel) return

        //Channel.send({
        //    content: '@everyone',
        //    embeds: [
        //        Embed
        //        .setDescription(`${reason}`)
        //    ]
        //})
    })
    .on("uncaughtException", (err, origin) => {
        console.log(err, origin)

        //const Channel = bot.channels.cache.get(`${bot.config.systeme.channelAntiCrash}`)

        //if (!Channel) return

        //Channel.send({
        //    content: '@everyone',
        //    embeds: [
        //        Embed
        //        .setDescription(`${err}`)
        //    ]
        //})
    })
}