const { Events } = require("discord.js")

module.exports = {
    name: Events.GuildCreate,
    execute(guild, bot) {
        bot.db.query(`
        CREATE TABLE IF NOT EXISTS \`ticket\`(
            \`guildId\` VARCHAR(255) NOT NULL,
            \`guildOwnerId\` VARCHAR(255) DEFAULT NULL,
            \`guildName\` VARCHAR(255) DEFAULT NULL,
            \`roles\` VARCHAR(255) DEFAULT NULL,
            \`channel_ticket\` VARCHAR(255) DEFAULT NULL,
            \`transcript\` VARCHAR(255) DEFAULT NULL,
            \`category\` VARCHAR(255) DEFAULT NULL,
            \`category_hautstaff\` VARCHAR(255) DEFAULT NULL,
            \`category_staff\` VARCHAR(255) DEFAULT NULL,
            \`category_autres\` VARCHAR(255) DEFAULT NULL,
            PRIMARY KEY (\`guildId\`)
        );`, (err) => {
            if (err) console.error(err);

            bot.db.query(`SELECT * FROM ticket WHERE guildId = "${guild.id}"`, (err, req) => {
                if(!req.length) {
                    bot.db.query(`INSERT INTO ticket(guildId, guildOwnerId, guildName) VALUES ("${guild.id}", "${guild.ownerId}", "${guild.name}")`)
                }
            })
        })
    }
}