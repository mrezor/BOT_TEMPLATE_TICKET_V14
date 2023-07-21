const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

class command {
    constructor() {
        this.name = "help",
        this.description = "Permets de voir toutes les commandes du Bot.",
        this.category = "Général",
        this.permission = "Aucune"
    }

    async execute(bot, interaction) {
        const categories = [...new Set(bot.commands.map((command) => command.category))];

        const Embed = new EmbedBuilder()
        .setColor(bot.config.clients.embedColor)
        .setTitle(`Help`)
        .setDescription(`*Nombre de commande → \`${bot.commands.size}\`*\n*Nombre de catégories → \`${categories.length}\`*`)
        .setTimestamp()
        .setFooter({text: "Commandes du robot"});

        categories.forEach((category) => {
            const filteredCommands = bot.commands.filter((command) => command.category === category);
            const commandsList = filteredCommands.map((command) => `> - ***${command.name}*** → *\`${command.description}\`*`).join('\n');
            
            Embed.addFields({ name: `**${category}**`, value: `${commandsList}` });
        });

        interaction.reply({
            embeds : [
                Embed
            ],
            ephemeral: true
        });
    }
}

module.exports = command