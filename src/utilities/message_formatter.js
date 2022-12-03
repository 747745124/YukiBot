import { EmbedBuilder } from 'discord.js'

const formatter = (message) => {
    return new EmbedBuilder().setColor(0x0099FF).setTitle(message.name).setURL(message.url).setDescription(`Model ${message.model} is now on stock!`).addFields({ name: 'price', value: message.price, inline: true }).addFields({ name: 'Notice', value: 'Best Buy typically go out 2-5 minutes before the item is available for purchase. Hurry while you can!' }).setImage(message.img).setTimestamp()
};

export { formatter };