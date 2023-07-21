const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');

class command {
    constructor() {
        this.name = "rename",
        this.description = "Permets de renommer un ticket.",
        this.category = "Ticket",
        this.permission = "Gérer les salons"
        this.options = [
            { 
                type: ApplicationCommandOptionType.String,
                name: "nom",
                description: "Écrivez un nom de ticket",
                required: true
            },
        ]
    }

    async execute(bot, interaction) {
        const Embed = new EmbedBuilder()
        .setColor(bot.config.clients.embedColor)
        .setTitle('📩・Ticket')
        .setTimestamp()
        .setFooter({ text: bot.config.clients.name, iconURL: bot.config.clients.logo});

        const sayMessage = interaction.options.getString('nom');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({
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
    
        interaction.channel.setName(`ticket-${sayMessage}`).then(() => {
            interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*✅・Le ticket a été renommé sous le nom **"ticket-${sayMessage.toString().replace(/[ ]+/g, "-").trim()}"** !*`)
                ],
                ephemeral: false
            })
        }).catch((err) => {
            interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*❌・**J'ai rencontré une erreur : ${err}***`)
                ],
                ephemeral: true
            })
        })
    }
}

module.exports = command