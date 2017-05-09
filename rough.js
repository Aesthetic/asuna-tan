const Discord = require('discord.js')
const client = new Discord.Client()
const settings = require('./settings.json')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

// on <Message> event
client.on('message', message => {
  // don't respond to other bots
  if (message.author.bot) return;

  // kill bot
  if (message.content === '$as kill') {
    console.log(`${message.author}(${message.author.username}) killed ${client.user.username}.`);
    message.channel.sendMessage(':(').then(() => {
      process.exit();
    });
  }

  // SAO is *not* trash.
  if (message.content.toLowerCase().includes('sao') && message.content.toLowerCase().includes('trash')) {
    console.log(`${message.author}(${message.author.username}) implied SAO is trash.`);
    message.reply('SAO is far from trash imho.');
  }

  // ping => pong
  if (message.content.toLowerCase() === 'ping') {
    console.log(`${message.author}(${message.author.username}) pinged ${client.user.username}.`);
    message.channel.sendMessage('pong!');
  }

  // $hello!
  if (message.content.toLowerCase() === '$hello') {
    console.log(`${message.author}(${message.author.username}) said hello to ${client.user.username}.`);
    message.channel.sendMessage(`hello ${message.author}!`);
  }

  // hitler => did nothing wrong
  if (message.content.toLowerCase().startsWith('$hitler')) {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    message.channel.sendMessage('did nothing wrong!');
  }

  // echos input and deleted parent message
  if (message.content.startsWith('$as echo ') && ((message.member.roles.exists('name','Aggressive'))||(message.member.roles.exists('name','Moderate')))) {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    message.channel.sendMessage(message.content.substring(9));
    message.delete();
  }

  // account info
  if (message.content.startsWith('$as uinfo')) {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    getAvatar(message);
    // TODO add more info + embed
  }

  // get avatar
  if (message.content.startsWith('$as avatar')) {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    getAvatar(message);
  }

  // purge selected number of messages
  if (message.content.startsWith('$as purge') && (message.member.roles.exists('name','Aggressive'))) {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    try {
      message.channel.bulkDelete(parseInt(message.content.substring(10), 10));
    } catch(e) {
      console.log(e);
    }
  }

  // returns Asuna-tan's uptime
  if(message.content === '$as uptime') {
    var hours = pad(Math.floor(process.uptime() / (60*60)),2);
    var minutes = pad(Math.floor(process.uptime() % (60*60) / 60),2);
    var seconds = pad(Math.floor(process.uptime() % 60),2);
    message.channel.sendMessage(`Uptime: ${hours}:${minutes}:${seconds}`);
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
  }

  // lists commands
  // TODO clean up + format + maintain
  if(message.content === '$as cmds') {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    message.channel.sendMessage("**General Responses**\n\`ping\` => \`pong!\`\nAny message containing \`SAO\` and \`trash\` (caps insensitive) => \`@user, SAO is far from trash imho.\`\n\n**General Commands**\n\`hitler\` => \`did nothing wrong!\`\n\`$as avatar [0-n] users\` => \`All mentioned user avatars\`\n\`$as uptime\` => \`hours:minutes:seconds\` of uptime\n\`$as uinfo [0-n] users\` => returns specified user info (only avatar as of now)\n\n**Admin Commands**\n\`$as echo\` => echos input and deletes parent message\n\`$as purge [2-n]\` => Purges selected number of messages");
  }
});

// retrieves avatar
function getAvatar(message) {
  var userArray = message.mentions.users.array()
  if (userArray.length < 1)
    userArray.push(message.author);
    var dist = {
      length: userArray.length,
      curr: 1
    }
  userArray.forEach(function(user) {
    var avatar = buildEmbed(message, user, dist);
    message.channel.sendEmbed(avatar);  //.sendMessage(`${user.username}: ${user.displayAvatarURL}`);
  });
}

// builds avatar embed
function buildEmbed(message, user, counts) {
  var embed = new Discord.RichEmbed()
  .setTitle(`${user.username}'s avatar as of this moment.`)
  .setColor(message.guild.member(client.user).highestRole.color)
  .setFooter(`This is ${counts.curr++} of ${counts.length} requests.`, client.user.displayAvatarURL)
  .setImage(user.displayAvatarURL)
  .setTimestamp()
  .setURL(client.user.displayAvatarURL)

  return embed;
}

// pads numbers for $as uptime
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

client.login(settings.token);
