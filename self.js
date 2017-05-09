const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const prefix = config.prefix;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

// on <Message> event
client.on('message', message => {
  // don't respond to other users
  if (message.author !== client.user) return;

  // ping => pong
  if (message.content.toLowerCase() === 'ping') {
    console.log(`${message.author}(${message.author.username}) pinged ${client.user.username}.`);
    message.channel.sendMessage('pong!');
  }

  if (message.content.startsWith(prefix + 'avatar')) {
    console.log(`${message.author}(${message.author.username}): ${message.content}`);
    message.mentions.users.array().forEach(function(user, index, array) {
      message.channel.sendEmbed(avatarEmbed(message, user, index, array.length));
    })
    message.delete();
  }
});

// builds avatar embed
function avatarEmbed(message, user, index, length) {
  var embed = new Discord.RichEmbed()
    .setTitle(`${user.username}'s avatar as of this moment.`)
    .setColor(message.guild.member(client.user).highestRole.color)
    .setFooter(`This is ${index+1} of ${length} requests.`, client.user.displayAvatarURL)
    .setImage(user.displayAvatarURL)
    .setTimestamp()
    .setURL(user.displayAvatarURL);
  return embed;
}
as
client.login(config.userToken);
