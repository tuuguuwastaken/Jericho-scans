const Discord = require('discord.js');

module.exports = {
    name:"invite",
    alias: "inv",
    description:'sends invite link in an embed',
    execute(client, message, args){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#7122bf')
        .setTitle('Invite for the discord server.')
        .addFields({name:'LINK ->> https://discord.gg/d6NRQkMGP6', value:"     [LINK BUTTON](https://discord.gg/d6NRQkMGP6)"})
        .setImage("https://i.imgur.com/ahbQUCG.png")
        .setFooter("If the link doesn't work, please contact an admin or the developer's");
        message.channel.send(newEmbed);
    }
}