const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

class command {
    constructor() {
        this.name = "ticket",
        this.description = "Permets d'envoyer le message pour ouvrir les tickets."
        this.category = "Ticket",
        this.permission = "Administrateur"
    }

    async execute(bot, interaction) {
        const Embed = new EmbedBuilder()
        .setColor(bot.config.clients.embedColor)
        .setTitle('📩・Ticket')
        .setTimestamp()
        .setFooter({ text: bot.config.clients.name, iconURL: bot.config.clients.logo});

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                Embed
                .setDescription(`*❌・**Tu n'as pas la permission d'exécuter cette commande** !*`)
            ],
            ephemeral: true
        })

        bot.db.query(`SELECT * FROM ticket WHERE guildId = "${interaction.guild.id}"`, (err, req) => {
            if(!req.length) return;
            
            const channel = req[0].channel_ticket;

            if(!interaction.channel.id === channel || channel === null || !bot.channels.cache.get(channel)) return interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*❌・**Tu ne te trouve pas dans le bon salon** !*`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(bot.config.clients.embedColor)
                    .setTitle('**Réagissez avec 📩 pour créer un ticket !**')
                    .setDescription(`Créez un ticket d'assistance pour contacter un membre du staff..`)
                    .setThumbnail('https://i.imgur.com/iKeoFPf.png')
                    .setTimestamp()
                    .setFooter({ text: bot.config.clients.name, iconURL: bot.config.clients.logo})
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setCustomId('ticket-button')
                        .setEmoji('📩')
                        .setLabel('Ouvrir un ticket')
                        .setStyle(ButtonStyle.Primary)
                    )
                ],
                ephemeral: false
            })
        })
    }
}

module.exports = command