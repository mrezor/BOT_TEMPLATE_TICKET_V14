const { Events } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, bot) {
        if(interaction.channel === null) return

        if(interaction.isCommand()) {
            if(!bot.commands.has(interaction.commandName)) return
            try {
                bot.commands.get(interaction.commandName).execute(bot, interaction)
            } catch (error) {
                console.error(error)
            }
        }
    }
}