 const Discord = require("discord.js");
module.exports = {
    name:"help",
    aliases:'h',
    description:'we dont care',
    execute(client,message,args){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#7122bf')
        .setTitle("All commands in Tokyo light Bot")
        .setDescription("Tokyo light Discord botiin Buh command uud")
        .addFields(
            {name:"youtube", value:"this has not been fully added yet"},
            {name:"invite", value:"Serveriin invite link heregtei bol ugdiin"},
            {name: "play and leave", value:"manai discord bot bas duunii bot baij bolno ;play isguibol ;p duuga songood tavij bolno"},
            {name:"More to add soon"}
        )
        .setImage("https://i.imgur.com/ahbQUCG.png")
        .setFooter("yumnii asuudal baival owner igsuibol Tuuguu#6913 luu DM bicherei");
        message.channel.send(newEmbed);
    }
}