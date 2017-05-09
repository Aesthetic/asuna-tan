const Discord = require('discord.js')
const bot = new Discord.Client()
const user = new Discord.Client()
const config = require('./config.json')
const prefix = config.prefix;

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}!`);
});
user.on('ready', () => {
  console.log(`Logged in as ${user.user.username}!`);
});

// on <message> event
user.on('message', message => {
  if(message.attachments.size != 0 && message.guild.name === config.donor.guild && message.channel.name === config.donor.channel) {
    console.log('message should send...')
    bot.guilds.find('name', config.recipient.guild).channels.find('name', config.recipient.channel).send(`Image from ${message.author} in ${message.guild.name}`, {
      files: [message.attachments.first().url]
    })
    .then(message => console.log(`Sent message: ${message.content}`))
    .catch(console.error);
  }

  if(message.guild.name === config.donor.guild && message.channel.name === config.donor.channel && /(http:\/\/|www\.)\S+/i.test(message.content)) {
    bot.guilds.find('name', config.recipient.guild).channels.find('name', config.recipient.channel).send(`${message.author}:${message.content}`)
    .then(message => console.log(`Sent message: ${message.content}`))
    .catch(console.error);
  }
});

bot.login(config.botToken);
user.login(config.userToken);
process.on('unhandledRejection', err => console.error(`Uncaught Promise Error: \n${err.stack}`));
