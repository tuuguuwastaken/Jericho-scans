let date_ob = new Date();
module.exports = {
    name: 'time',
    description: "tell the time.",
    execute(client, message, args){
        message.channel.send(" time for the discord bot: "+date_ob.getHours()+":"+date_ob.getMinutes()+" date: "+date_ob.getFullYear()+"/"+(date_ob.getMonth()+1)+"/"+date_ob.getDate());
    }
}