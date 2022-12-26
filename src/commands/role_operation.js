import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const rolesCommand = new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Add a role to a channel')
    .addRoleOption((option) => option.setName('new_role')
        .setDescription('Adds the new role')
        .setRequired(true));

export default rolesCommand.toJSON();