const Discord = require('discord.js');
const client = new Discord.Client()
const config = require('./config.json')///config file
client.login(config.Token)///bot login
const db = require('quick.db');////do 'npm install quick.db'
let prefix = '-';////The Prefix here.



client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}`)
});





client.on('message', async message =>{
    if(message.content.startsWith(prefix + 'set-room')){
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("You dont have the required permission `ADMINISTRATOR` ");
        let ChannelID = message.content.split(" ").slice(1).join(" ");
        if(!ChannelID) return message.channel.send(`Please specify a room`)

        await db.set(`Channel_${message.guild.id}`, ChannelID)
        message.channel.send(`Done set the room <#${ChannelID}>`)
    } else {
        if(message.content.startsWith(prefix + 'room')){
            if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("You dont have the required permission `ADMINISTRATOR` ");

            let ChannelFetch = await db.fetch(`Channel_${message.guild.id}`)

            message.channel.send(`The room is <#${ChannelFetch}>`)
        }
    }
    
})


client.on('message', async message =>{
    if(!message.guild.id) return;
    if(message.author.bot) return;
    let sug = message.content;
    let ChannelSug = await db.fetch(`Channel_${message.guild.id}`)

        if(message.channel.id !== ChannelSug) return;

        const SugEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle(`Sug is:`)
        .setDescription(`${sug}`)
        .setFooter(message.guild.name, message.guild.iconURL())
        await message.delete()
        message.channel.send(SugEmbed).then(async message =>{
            await message.react('✅')
            await message.react('❌')
        })
        
    })