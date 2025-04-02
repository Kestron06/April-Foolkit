process.env=Object.assign(process.env,require("./env.json"));
var storage=require("./storage.json");
const fs=require("fs");
function save(){
    fs.writeFileSync("./storage.json",JSON.stringify(storage));
}
const {Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits, ModalBuilder, TextInputBuilder, TextInputStyle, Partials, ActivityType, PermissionFlagsBits, DMChannel, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType,AuditLogEvent, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageReaction, MessageType}=require("discord.js");
var ints=Object.keys(GatewayIntentBits).map(a=>GatewayIntentBits[a]);
ints.splice(ints.indexOf(GatewayIntentBits.GuildPresences),1);
ints.splice(ints.indexOf("GuildPresences"),1);
const client=new Client({
    intents:ints,
    partials:Object.keys(Partials).map(a=>Partials[a])
});
client.once("ready",()=>{
    console.log("Fooler Online");
});
client.on("messageCreate",async msg=>{
    if(msg.content.startsWith("~")&&msg.channel.permissionsFor(msg.author).has(PermissionFlagsBits.Administrator)){
        switch(msg.content.split(" ")[0].split("~")[1]){
            case "switch":
                storage[msg.guild.id]={members:{}};
                await msg.guild.members.fetch().then(d=>{
                    d.forEach(member=>{
                        storage[msg.guild.id].members[member.id]=member.nickname||member.user.globalName||member.user.username;
                    });
                });
                save();
                var newNames=[];
                Object.keys(storage[msg.guild.id].members).forEach(key=>{newNames.push(storage[msg.guild.id].members[key])});
                await msg.guild.members.fetch().then(d=>{
                    d.forEach(member=>{
                        if(member.bannable){
                            var num=Math.floor(Math.random()*newNames.length);
                            member.setNickname(newNames[num]);
                            newNames.splice(num,1);
                        }
                    });
                });
            break;
            case "unswitch":
                if(!storage.hasOwnProperty(msg.guild.id)) break;
                await msg.guild.members.fetch().then(d=>{
                    d.forEach(member=>{
                        if(member.bannable){
                            member.setNickname(storage[msg.guild.id].members[member.id]);
                        }
                    });
                });
            break;
        }
    }
});
client.login(process.env.token);