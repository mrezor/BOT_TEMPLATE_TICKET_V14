const { StringSelectMenuBuilder, ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ChannelType, ButtonStyle, ComponentType, Events } = require("discord.js");
const transcript = require('discord-html-transcripts');

module.exports = {
  name: Events.InteractionCreate,
  execute(interaction, bot) {
    if(interaction.channel === null) return;

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
      
      bot.db.query(`SELECT * FROM ticket WHERE guildId = "${interaction.guild.id}"`, async (err, req) => {
        if(!req.length) return;

        const guildId = req[0].guildId;
        const roles = req[0].roles;
        const transcripts = req[0].transcript;
        const category = req[0].category;
        const category_hautstaff = req[0].category_hautstaff;
        const category_staff = req[0].category_staff;
        const category_autres = req[0].category_autres;

        if(interaction.customId == "ticket-button"){
          if(roles === null){
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription('*❌・Vous n\'avez pas configuré de **role** pour les **ticket**.*\n\n***Utilise /config afin de le configuré.***')
              ],
              ephemeral: true
            })
          } else if(transcripts === null){
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription('*❌・Vous n\'avez pas configuré de **channel** pour les **transcripts** des **ticket**.*\n\n***Utilise /config afin de le configuré.***')
              ],
              ephemeral: true
            })
          } else if(category === null){
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription('*❌・Vous n\'avez pas configuré de **category** pour les **ticket**.*\n\n***Utilise /config afin de la configuré.***')
              ],
              ephemeral: true
            })
          } else if(category_hautstaff === null){
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription('*❌・Vous n\'avez pas configuré de category **Haut Staff** pour les **ticket**.*\n\n***Utilise /config afin de la configuré.***')
              ],
              ephemeral: true
            })
          } else if(category_staff === null){
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription('*❌・Vous n\'avez pas configuré de category **Staff** pour les **ticket**.*\n\n***Utilise /config afin de la configuré.***')
              ],
              ephemeral: true
            })
          } else if(category_autres === null){
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription('*❌・Vous n\'avez pas configuré de category **Autres** pour les **ticket**.*\n\n***Utilise /config afin de la configuré.***')
              ],
              ephemeral: true
            })
          }

          if(bot.guilds.cache.get(guildId).channels.cache.find(c => c.topic == interaction.user.id)){
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription('❌・*Vous disposez déjà d\'un **ticket***')
              ],
              ephemeral: true
            })
          }

          if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)){
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription(`*❌・Permission manquante : \`Administrateur\`*`)
              ],
              ephemeral: true
            })
          }

          let Modal = new ModalBuilder()
          .setCustomId('questionnaire')
          .setTitle('Répond au questionnaire')

          let question1 = new TextInputBuilder()
          .setCustomId('raison')
          .setLabel(`Quel est la raison d'ouverture du ticket ?`)
          .setPlaceholder('Ecrit ici...')
          .setRequired(true)
          .setStyle(TextInputStyle.Paragraph)

          let question2 = new TextInputBuilder()
          .setCustomId('qui')
          .setLabel(`A qui est adressé ce ticket ?`)
          .setPlaceholder('Ecrit ici...')
          .setRequired(true)
          .setStyle(TextInputStyle.Short)

          let ActionRow1 = new ActionRowBuilder().addComponents(question1);
          let ActionRow2 = new ActionRowBuilder().addComponents(question2);

          Modal.addComponents(ActionRow1, ActionRow2)

          await interaction.showModal(Modal)

          const submitted = await interaction.awaitModalSubmit({
            time: 420000,
            filter: (i) => i.user.id === interaction.user.id,
          }).catch(error => {
            console.error(error)
            return null
          })

          if (submitted) {
            await submitted.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription(`*✅・La réponse à votre questionnaire à bien été envoyé !*`)
              ],
              ephemeral: true
            }).catch((err) => { return });

            await interaction.guild.channels.create({
              name: `ticket-0${entierAleatoire(100, 900)}`,
              parent: category,
              topic: interaction.user.id,
              type: ChannelType.GuildText,
              permissionOverwrites: [
                // Membre
                {
                  id: interaction.user.id,
                  allow: [
                    PermissionsBitField.Flags.ViewChannel
                  ],
                  deny: [
                    PermissionsBitField.Flags.SendMessages
                  ]
                },
                // Support
                {
                  id: roles,
                  allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages
                  ]
                },
                // bot
                {
                  id: bot.user.id,
                  allow: [
                    PermissionsBitField.All
                  ]
                },
                // everyone
                {
                  id: interaction.guild.roles.everyone,
                  deny: [
                    PermissionsBitField.Flags.ViewChannel
                  ]
                }
              ]
            }).then(async c => {
              await interaction.followUp({
                embeds: [
                  new EmbedBuilder()
                  .setColor(bot.config.clients.embedColor)
                  .setDescription(`*✅・Votre **ticket** à bien été créer : ${c}*`)
                ],
                ephemeral: true
              })

              await c.send({
                embeds: [
                  new EmbedBuilder()
                  .setColor(bot.config.clients.embedColor)
                  .setDescription(`*Bonjour ${interaction.user}, Merci d'avoir créé un ticket d'assistance.\nAfin de gérer au mieux votre demande merci de bien vouloir choisir la catégorie liée à votre souci.*`)
                ],
                ephemeral: false
              })

              const components = (state) => [
                new ActionRowBuilder().addComponents(
                  new StringSelectMenuBuilder()
                  .setCustomId('category')
                  .setPlaceholder('Séléctionnez la catégorie du ticket')
                  .setDisabled(state)
                  .addOptions([{
                      label: 'Haut Staff',
                      value: 'hstaff',
                      emoji: '🪙',
                    },
                    {
                      label: 'Staff',
                      value: 'staff',
                      emoji: '🎮',
                    },
                    {
                      label: 'Autres',
                      value: 'autre',
                      emoji: '📔',
                    },
                  ]),
                )
              ]
            
              msg = await c.send({
                embeds: [
                  new EmbedBuilder()
                  .setColor(bot.config.clients.embedColor)
                  .setDescription('*⚠️・Séléctionnez la catégorie de votre ticket*')
                ],
                components: components(false),
                ephemeral: false
              })
            
              const collector = await msg.createMessageComponentCollector({
                componentType: ComponentType.SelectMenu,
                time: 20000
              })

              collector.on('collect', async i => {
                if(i.user.id === interaction.user.id) {
                  msg.edit({ components: components(true) }).catch(() => { return })

                  if (i.values[0] === 'hstaff') {
                    c.edit({
                      parent: category_hautstaff,
                      permissionOverwrites: [
                        // Membre
                        {
                          id: interaction.user.id,
                          allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages
                          ]
                        },
                        // Support
                        {
                          id: roles,
                          allow: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ViewChannel
                          ],
                        },
                        // bot
                        {
                          id: bot.user.id,
                          allow: [
                            PermissionsBitField.All
                          ],
                        },
                        // Everyone
                        {
                          id: interaction.guild.roles.everyone,
                          deny: [
                            PermissionsBitField.Flags.ViewChannel
                          ],
                        },
                      ],
                    }).catch(async (err) => {
                      await interaction.reply({
                        embeds: [
                          new EmbedBuilder()
                          .setColor(bot.config.clients.embedColor)
                          .setDescription(`*❌・Permission manquantes : \`Administrateur\`*`)
                        ],
                        ephemeral: true
                      })
                    });
                  };
                
                  if (i.values[0] == 'staff') {
                    c.edit({
                      parent: category_staff,
                      permissionOverwrites: [
                        // Membre
                        {
                          id: interaction.user.id,
                          allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages
                          ]
                        },
                        // Support
                        {
                          id: roles,
                          allow: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ViewChannel
                          ],
                        },
                        // bot
                        {
                          id: bot.user.id,
                          allow: [
                            PermissionsBitField.All
                          ],
                        },
                        // Everyone
                        {
                          id: interaction.guild.roles.everyone,
                          deny: [
                            PermissionsBitField.Flags.ViewChannel
                          ],
                        },
                      ],
                    }).catch(async (err) => {
                      await interaction.reply({
                        embeds: [
                          new EmbedBuilder()
                          .setColor(bot.config.clients.embedColor)
                          .setDescription(`*❌・Permission manquantes : \`Administrateur\`*`)
                        ],
                        ephemeral: true
                      })
                    });
                  };

                
                  if (i.values[0] == 'autre') {
                    c.edit({
                      parent: category_autres,
                      permissionOverwrites: [
                        // Membre
                        {
                          id: interaction.user.id,
                          allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages
                          ]
                        },
                        // Support
                        {
                          id: roles,
                          allow: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ViewChannel
                          ],
                        },
                        // bot
                        {
                          id: bot.user.id,
                          allow: [
                            PermissionsBitField.All
                          ],
                        },
                        // Everyone
                        {
                          id: interaction.guild.roles.everyone,
                          deny: [
                            PermissionsBitField.Flags.ViewChannel
                          ],
                        },
                      ],
                    }).catch(async (err) => {
                      await interaction.reply({
                        embeds: [
                          new EmbedBuilder()
                          .setColor(bot.config.clients.embedColor)
                          .setDescription(`*❌・Permission manquantes : \`Administrateur\`*`)
                        ],
                        ephemeral: true
                      })
                    });
                  }
                
                  const states = {
                    'hstaff': 'Haut Staff',
                    'staff': 'Staff',
                    'autre': 'Autres'
                  }
                
                  let raison = submitted.fields.getTextInputValue('raison');
                  let qui = submitted.fields.getTextInputValue('qui');

                  i.reply({
                    embeds: [
                      new EmbedBuilder()
                      .setColor(bot.config.clients.embedColor)
                      .setDescription(`*✅・Votre catégorie à bien été choisis : **${states[i.values[0]]}***`)
                    ],
                    ephemeral: true
                  })

                  await c.send({
                    embeds: [
                      new EmbedBuilder()
                      .setColor(bot.config.clients.embedColor)
                      .setDescription(`Merci d'avoir choisi la catégorie **${states[i.values[0]]}**. 
                      Merci d'attendre patiemment qu'un membre de notre équipe vous contacte.`)
                      .addFields(
                        { name: '📃 Quel est la raison d\'ouverture du ticket ?', value: `${raison}` },
                        { name: '📃 A qui est adressé ce ticket ?', value: `${qui}` },
                      )
                    ],
                    components: [
                      new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                        .setCustomId('close-ticket')
                        .setLabel('Fermer le ticket')
                        .setEmoji('899745362137477181')
                        .setStyle(ButtonStyle.Danger),
                      
                        new ButtonBuilder()
                        .setCustomId('transcript-ticket')
                        .setLabel('Demander le transcript')
                        .setEmoji('📑')
                        .setStyle(ButtonStyle.Danger),
                      
                        new ButtonBuilder()
                        .setCustomId('prendre-ticket')
                        .setLabel('Prendre en charge')
                        .setEmoji('⚠️')
                        .setStyle(ButtonStyle.Danger),
                      )
                    ],
                    ephemeral: false
                  })
                }
              })
            
              collector.on('end', () => {
                msg.edit({
                  components: components(true)
                }).catch(() => { return })
              })
            })
          }
        }

        if (interaction.customId == "close-ticket") {
          interaction.reply({ 
            embeds: [
              new EmbedBuilder()
              .setColor(bot.config.clients.embedColor)
              .setDescription(`*Voulez-vous effectuer un transcrit ?*`)
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
            ]
          });
        };

        if(interaction.customId === "fermer") {
          const guild = bot.guilds.cache.get(interaction.guildId);
          const channel = guild.channels.cache.get(interaction.channelId);

          interaction.reply({
            embeds: [
              new EmbedBuilder()
              .setColor(bot.config.clients.embedColor)
              .setDescription(`*✅・Suppression du ticket...*`)
            ]
          });

          setTimeout(() => {
            channel.delete();
          }, 2000);
        }

        if(interaction.customId === "fermer_transcript") {
          const guild = bot.guilds.cache.get(interaction.guildId);
          const channel = guild.channels.cache.get(interaction.channelId);

          await interaction.deferReply({ ephemeral: true })

          await bot.channels.cache.get(transcripts).send({
            embeds: [
              new EmbedBuilder()
              .setColor(bot.config.clients.embedColor)
              .setDescription(`*📑・Transcript demandé par ${interaction.member}*`)
            ],
            files: [
              await transcript.createTranscript(interaction.channel)
            ]
          })

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
              .setColor(bot.config.clients.embedColor)
              .setDescription(`*✅・Transcript envoyé avec succès, Suppression du Ticket...*`)
            ],
            ephemeral: true
          })

          setTimeout(() => {
            channel.delete();
          }, 2000);
        }

        if(interaction.customId === "transcript-ticket") {
          await interaction.deferReply({ ephemeral: true })

          await bot.channels.cache.get(transcripts).send({
            embeds: [
              new EmbedBuilder()
              .setColor(bot.config.clients.embedColor)
              .setDescription(`*📑・Transcript demandé par ${interaction.member}*`)
            ],
            files: [
              await transcript.createTranscript(interaction.channel)
            ]
          })

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
              .setColor(bot.config.clients.embedColor)
              .setDescription(`*✅・Transcript envoyé avec succès !*`)
            ],
            ephemeral: true
          })
        }

        if(interaction.customId === "prendre-ticket") {
          if(interaction.member.roles.cache.has(roles)) {
            await interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription(`*✅・${interaction.member} prend en charge le ticket !*`)
              ],
              ephemeral: false
            })
          } else {
            await interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setColor(bot.config.clients.embedColor)
                .setDescription(`*❌・${interaction.member} vous ne faites pas partie de l'équipe de support !*`)
              ],
              ephemeral: true
            })
          }
        }
      })
    })
  }
}

function entierAleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}