const ytdl =  require("ytdl-core");
const ytsearch = require('yt-search');
const { Permissions } =require("discord.js");
module.exports = {
    name: 'play',
    aliases: 'p',
    description: 'youtube video audio player',
    async execute(client, message, args){
        const vc = message.member.voice.channel;
        if(!vc){
            message.channel.send("You have to join a channel");
        }
        const perm = vc.permissionsFor(message.client.user);
        if(!perm.has('CONNECT')) return message.channel.send("I dont have permission to join");
        if(!perm.has('SPEAK')) return message.channel.send("I dont have premission to speak");
        if(!args.length) return message.channel.send("Please enter a keyword");

        const validURL = (str) =>{
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if(!regex.test(str)){
                return false;
            } else {
                return true;
            }
        }

        const videoFinder = async (query) => {
            const vidResult = await ytsearch(query);

            return (vidResult.videos.length > 1) ? vidResult.videos[0] : null;
        }
        const vid = await videoFinder(args.join(' '));


        if(validURL(args[0])){
            const conn = await vc.join();
            const stream = ytdl(args[0], {filter: 'audioonly'});
            conn.play(stream, {seek: 0, volume: 1})
            .on("finish", () => {
                vc.leave();
            });
            await message.reply(`currently playing "***${vid.title}***"`);
            return;
        }

        if(vid){
            const conn = await vc.join();
            const stream = ytdl(vid.url, {filter: 'audioonly'});
            conn.play(stream, {seek: 0, volume: 1})
            .on("finish", () => {
                vc.leave();
            });
            await message.reply(`currently playing"***${vid.title}***" `);
        } else {
            message.channel.send("couldn't find the video/song ");
        }
    }
}