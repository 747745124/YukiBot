import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
const check_rate_cmd = new SlashCommandBuilder()
    .setName("checkrate")
    .setDescription("check conversion rate for 2 different currencies, in all caps e.g. USD, CNY, GPD, EUR")
    .addStringOption(option =>
        option
            .setName('currency_1')
            .setDescription('The first currency')
            .setRequired(true)).addStringOption(option =>
                option
                    .setName('currency_2')
                    .setDescription('The second currency')
                    .setRequired(true))
export default check_rate_cmd.toJSON();