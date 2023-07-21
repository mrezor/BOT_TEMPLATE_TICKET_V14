const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');

class command {
    constructor() {
        this.name = "config",
        this.description = "Permets de configurer le Bot sur le serveur.",
        this.category = "Outils",
        this.permission = "Administrateur",
        this.options = [
            { 
                type: ApplicationCommandOptionType.String,
                name: "section", 
                description: "SECTION.", 
                required: true,
                choices: [
                    { name: '⭐ Role Ticket', value: 'roleticket'},
                    { name: '📝 Salon de Ticket', value: 'channelticket'},
                    { name: '📝 Salon de Transcript Ticket', value: 'channeltranscriptticket'},
                    { name: '📃 Category de Ticket', value: 'category'},
                    { name: '📃 Category de Ticket Haut Staff', value: 'categoryhautstaff'},
                    { name: '📃 Category de Ticket Staff', value: 'categorystaff'},
                    { name: '📃 Category de Ticket Autres', value: 'categoryautres'},
                ]
            },
            { 
                type: ApplicationCommandOptionType.Channel, 
                name: "channel", 
                description: "Veuillez choisir un channel", 
                required: false 
            },
            { 
                type: ApplicationCommandOptionType.Role, 
                name: "role", 
                description: "Veuillez choisir un role", 
                required: false 
            }
        ]
    }

    async execute(bot, interaction) {
        const Embed = new EmbedBuilder()
        .setColor(bot.config.clients.embedColor)
        .setTitle('🔧・Configuration')
        .setTimestamp()
        .setFooter({ text: bot.config.clients.name, iconURL: bot.config.clients.logo});

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                Embed
                .setDescription(`*❌・**Tu n'as pas la permission d'exécuter cette commande** !*`)
            ],
            ephemeral: true
        })

        let section = interaction.options.getString('section');
        let channel = interaction.options.getChannel('channel');
        let role = interaction.options.getRole('role');

        if (section == 'channelticket'){
            if(!channel) return interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*❌・**Mauvais usage de la commandes (config <section> <channel>)** !*`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*✅・Le **salon** ${channel} à bien été **sauvegardé** comme salons de **ticket** !*`)
                ],
                ephemeral: true
            })

            bot.db.query(`UPDATE ticket SET channel_ticket = '${channel.toString().replace(/[<#> ]+/g, "").trim()}' WHERE guildId = ${interaction.guild.id}`)
        } else if (section == 'categoryhautstaff'){
            if(!channel) return interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*❌・**Mauvais usage de la commandes (config <section> <category>)** !*`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*✅・La **catégorie** "${channel.id}" à bien été **sauvegardé** comme catégorie de **ticket haut staff** !*`)
                ],
                ephemeral: true
            })

            bot.db.query(`UPDATE ticket SET category_hautstaff = '${channel.toString().replace(/[<#> ]+/g, "").trim()}' WHERE guildId = ${interaction.guild.id}`)
        } else if (section == 'categorystaff'){
            if(!channel) return interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*❌・**Mauvais usage de la commandes (config <section> <category>)** !*`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*✅・La **catégorie** "${channel.id}" à bien été **sauvegardé** comme catégorie de **ticket staff** !*`)
                ],
                ephemeral: true
            })

            bot.db.query(`UPDATE ticket SET category_staff = '${channel.toString().replace(/[<#> ]+/g, "").trim()}' WHERE guildId = ${interaction.guild.id}`)
        } else if (section == 'categoryautres'){
            if(!channel) return interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*❌・**Mauvais usage de la commandes (config <section> <category>)** !*`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*✅・La **catégorie** "${channel.id}" à bien été **sauvegardé** comme catégorie de **ticket autres** !*`)
                ],
                ephemeral: true
            })

            bot.db.query(`UPDATE ticket SET category_autres = '${channel.toString().replace(/[<#> ]+/g, "").trim()}' WHERE guildId = ${interaction.guild.id}`)
        } else if (section == 'roleticket'){
            if(!role) return interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*❌・**Mauvais usage de la commandes (config <section> <role>)** !*`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*✅・Le **role** ${role} à bien été **sauvegardé** comme grades du **support ticket** !*`)
                ],
                ephemeral: true
            })

            bot.db.query(`UPDATE ticket SET roles = '${role.toString().replace(/[<@&> ]+/g, "").trim()}' WHERE guildId = ${interaction.guild.id}`)
        } else if (section == 'category'){
            if(!channel) return interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*❌・**Mauvais usage de la commandes (config <section> <category>)** !*`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*✅・La **catégorie** "${channel.id}" à bien été **sauvegardé** catégorie de **ticket** !*`)
                ],
                ephemeral: true
            })

            bot.db.query(`UPDATE ticket SET category = '${channel.toString().replace(/[<#> ]+/g, "").trim()}' WHERE guildId = ${interaction.guild.id}`)
        } else if (section == 'channeltranscriptticket'){
            if(!channel) return interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*❌・**Mauvais usage de la commandes (config <section> <channel>)** !*`)
                ],
                ephemeral: true
            })

            interaction.reply({
                embeds: [
                    Embed
                    .setDescription(`*✅・Le **salons** ${channel} à bien été **sauvegardé** comme salons de **transcript ticket** !*`)
                ],
                ephemeral: true
            })

            bot.db.query(`UPDATE ticket SET transcript = '${channel.toString().replace(/[<#> ]+/g, "").trim()}' WHERE guildId = ${interaction.guild.id}`)
        }
    }
}

module.exports = command