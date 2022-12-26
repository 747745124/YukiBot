import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
//register playmusic command
const playMusic_cmd = new SlashCommandBuilder()
    .setName("playmusic")
    .setDescription("Play a piece of music from Spotify")
    .addStringOption(option =>
        option
            .setName('song_name')
            .setDescription('The song to be played')
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName('artist_name')
            .setDescription('The artist of the song')
            .setRequired(false))

export default playMusic_cmd.toJSON();