const Discord = require('discord.js');

module.exports = {
    name: 'intro',
    cooldown:10,
    desciprtion: 'gives and introduction to the server',
    execute(client, message, args){
        message.channel.bulkDelete(1);
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#7122bf')
        .setTitle("Nobles Masquerade Bot")
        .setDescription("This is a Nobles Masquerade bot")
        .addFields(
            {name:'Hello', value:'For commands please enter ***;help***'},
            {name:"How you doing?", value:"Coded in nodejs"},
        )
        .setImage("https://i.imgur.com/1HNWisf.png")
        .setFooter("written by yours truly members");
        message.channel.send(newEmbed);
    }
}