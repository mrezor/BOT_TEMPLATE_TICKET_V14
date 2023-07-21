const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');

class command {
    constructor() {
        this.name = "close",
        this.description = "Permets de supprimer un ticket."
        this.category = "Ticket",
        this.permission = "Gérer les salons"
    }

    async execute(bot, interaction) {
        const Embed = new EmbedBuilder()
        .setColor(bot.config.clients.embedColor)
        .setTitle('📩・Ticket')
        .setTimestamp()
        .setFooter({ text: bot.config.clients.name, iconURL: bot.config.clients.logo});
                    
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({
            embeds: [
                Embed
                .setDescription(`*❌・**Tu n'as pas la permission d'exécuter cette commande** !*`)
            ],
            ephemeral: true
        })

        if (!interaction.channel.name.includes('ticket')) return interaction.reply({
            embeds: [
                Embed
                .setDescription("*❌・**Vous ne vous trouvez pas dans un ticket** !*")
            ],
            ephemeral: true
        })
    
        interaction.reply({
            embeds: [
                Embed
                .setDescription(`*⚠️・Voulez-vous effectué un Transcript ?*`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('fermer_transcript')
                    .setLabel('Oui')
                    .setEmoji('📑')
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('fermer')
                    .setLabel('Non')
                    .setEmoji('899745362137477181')
                    .setStyle(ButtonStyle.Danger),
                )
            ],
            ephemeral: false
        })
    }
}

module.exports = command