/*
  * Code By: Ali#0007
  * Please Follow Me On Github
*/
const Discord = require('discord.js');
const client = new Discord.Client()
const config = require('./config.json')///config file
client.login(config.Token)///bot login
const db = require('quick.db');////do 'npm install quick.db'
let prefix = config.prefix



client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}`)
    console.log(`Bot developer: Ali#0007`)
    client.user.setActivity(`${prefix}help`)
});




client.on('message', async message => {
    if (message.content.startsWith(prefix + 'sugs on')) { 
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("You dont have the required permission `ADMINISTRATOR` ");

        await db.set(`Sugs_${message.guild.id}`, "on")
        message.channel.send(`Suggestion turned on! `) 
    } else {
        if (message.content.startsWith(prefix + 'sugs off')) { 
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("You dont have the required permission `ADMINISTRATOR` ");

            await db.set(`Sugs_${message.guild.id}`, "off")
            message.channel.send(`Suggestion turned off! `) 

        } else {
            if (message.content.startsWith(prefix + 'sug-status')) {
                if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("You dont have the required permission `ADMINISTRATOR` ");
                let ChannelFetch = await db.fetch(`Channel_${message.guild.id}`)
                let sugsStatus = await db.fetch(`Sugs_${message.guild.id}`)
                await message.channel.send(`Sugs is: **${sugsStatus}**\nThe Room is: <#${ChannelFetch}>`) 

            } else {
                if (message.content.startsWith(prefix + 'set-room')) { 
                    let Suggestion = await db.fetch(`Sugs_${message.guild.id}`)
                    if (Suggestion == "off" || Suggestion == null) return message.channel.send(`Please activate the sugs first ${prefix}sugs on`)
                    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("You dont have the required permission `ADMINISTRATOR` ");
                    let ChannelID = message.content.split(" ").slice(1).join(" ");
                    if (!ChannelID) return message.channel.send(`Please specify an id for room`)

                    await db.set(`Channel_${message.guild.id}`, ChannelID) 
                    message.channel.send(`Done set the room <#${ChannelID}>`)
                } else {
                    if (message.content === prefix + 'help') {
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`Help`)
                            .setDescription(`
                                1) ${prefix}sugs on / ${prefix}sugs off | turn on and off the suggestions.
                                2) ${prefix}set-room | set the suggestion room.
                                3) ${prefix}sug-status | show the suggestion status.
            `) 
                            .setFooter(`Request By: ${message.author.tag}`, message.author.avatarURL())
                        message.channel.send(embed)
                    } else {
                        { 
                            let suggestion = await db.fetch(`Sugs_${message.guild.id}`)
                            if (suggestion == "off") {
                                return;
                            } else if (suggestion == "on") { 
                                if (!message.guild.id) return;
                                if (message.author.bot) return;
                                let sug = message.content;
                                let ChannelSug = await db.fetch(`Channel_${message.guild.id}`)

                                if (message.channel.id !== ChannelSug) return;

                                const SugEmbed = new Discord.MessageEmbed() 
                                    .setAuthor(message.author.tag, message.author.avatarURL())
                                    .setTitle(`Sug is:`)
                                    .setDescription(`${sug}`)
                                    .setFooter(message.guild.name, message.guild.iconURL())
                                await message.delete()
                                message.channel.send(SugEmbed).then(async message => {
                                    await message.react('✅')
                                    await message.react('❌')
                                }) 
                            }


                        }
                    }

                }
            }
        }
    }
}) 

