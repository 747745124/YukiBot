import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { config } from 'dotenv'
config();

export default {
    data: new SlashCommandBuilder()
        .setName('thanos')
        .setDescription('Randomly timeout a user for a random period of time, the upper limit would be 2 minutes.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const guild = client.guilds.resolve(process.env.GUILD_ID);
        // Iterate through the collection of GuildMembers from the Guild getting the username property of each member 
        guild.members.fetch()
            .then((members) => {

                function getRandomKey(collection) {
                    let keys = Array.from(collection.keys());
                    return keys[Math.floor(Math.random() * keys.length)];
                }

                // console.log(members.get(getRandomKey(members)))
                const member = members.get(getRandomKey(members))
                const seconds = Math.random() * 100

                member.timeout(seconds, 'You deserved it')
                    .then(console.log)
                    .catch(console.error);

                interaction.reply({ content: `${member.user.username}. You deserved it!\n${member.user.username} has been muted for ${seconds.toFixed(2)} seconds` })

            })
            .catch(console.error);
    },
};