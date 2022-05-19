 const Discord = require("discord.js");
module.exports = {
    name:"help",
    aliases:'h',
    description:'we dont care',
    execute(client,message,args){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#7122bf')
        .setTitle("All commands in Noble's masquerade server")
        .setDescription("All the commands here bellow")
        .addFields(
            {name:"Youtube", value:"this has not been fully added yet"},
            {name:"invite", value:"Output The invite link for the current server"},
            {name: "play and leave", value:"A music bot implemented for the sake of listening to music"},
            {name:"More to add soon"}
        )
        .setImage("https://i.imgur.com/ahbQUCG.png")
        .setFooter("is any problems arise please contact the devs");
        message.channel.send(newEmbed);
    }
}