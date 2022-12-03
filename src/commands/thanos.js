import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('thanos')
        .setDescription('Randomly timeout a user for a random number of seconds, max duration is 2 minutes.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to timeout')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await userban
    },
};