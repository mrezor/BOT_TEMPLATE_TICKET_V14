const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');

class command {
    constructor() {
        this.name = "remove",
        this.description = "Permets de retirer un utilisateur d'un ticket.",
        this.category = "Ticket",
        this.permission = "Gérer un membre",
        this.options = [
            { 
                type: ApplicationCommandOptionType.User,
                name: "membre",
                description: "Veuillez choisir un membre",
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

        let user = interaction.options.getUser('membre');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({
            embeds: [
                Embed
                .setDescription(`*❌・**Tu n'as pas la permission d'exécuter cette commande** !*`)
            ],
            ephemeral: true
        })

        bot.db.query(`SELECT * FROM ticket WHERE guildId = "${interaction.guild.id}"`, (err, req) => {
            const roles = req[0].roles;
            
            if (!interaction.channel.name.includes('ticket')) return interaction.reply({
                embeds: [
                    Embed
                    .setDescription("*❌・**Vous ne vous trouvez pas dans un ticket** !*")
                ],
                ephemeral: true
            })

            interaction.channel.edit({
                permissionOverwrites: [
                    {
                        id: user,
                        deny: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ViewChannel
                        ]
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [
                            PermissionsBitField.Flags.ViewChannel
                        ]
                    },
                    {
                        id: roles,
                        allow: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ViewChannel
                        ]
                    }
                ]
            }).then(() => {
                interaction.reply({
                    embeds: [
                        Embed
                        .setDescription(`*✅・Le membre ${user} a été retirer du ticket !*`)
                    ],
                    ephemeral: false
                })
            }).catch((err) => {
                interaction.reply({
                    embeds: [
                        Embed.setDescription(`*❌・**J'ai rencontré une erreur : ${err}***`)
                    ],
                    ephemeral: true
                })
            })
        })
    }
}


module.exports = command