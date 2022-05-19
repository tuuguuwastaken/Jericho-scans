module.exports = {
    name:"leave",
    aliases: "zail",
    description:"leaves the chanenl",
    async execute(client, message, args){
        const vc = message.member.voice.channel;
        if(!vc){
            message.channel.send("I have to be in a voice channel first");
        }
        await vc.leave();
        await message.channel.send(" Aite I'm leaving :smiling_face_with_tear:");
    }
}