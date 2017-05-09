const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const prefix = config.prefix;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

// on <Message> event
client.on('message', message => {
  // don't respond to other bots
  if (message.author.bot) return;

  // kill bot
  if (message.content === prefix + 'kill') {
    console.log(`${message.author}(${message.author.username}) killed ${client.user.username}.`);
    message.channel.sendMessage(':(').then(() => {
      process.exit();
    });
  }

  // ping => pong
  if (message.content.toLowerCase() === 'ping') {
    console.log(`${message.author}(${message.author.username}) pinged ${client.user.username}.`);
    message.channel.sendMessage('pong!');
  }

  // echos input and deleted parent message
  // TODO fix role perms
  if (message.content.startsWith(prefix + 'echo ') && ((message.member.roles.exists('name','Aggressive'))||(message.member.roles.exists('name','Moderate')))) {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    message.channel.sendMessage(message.content.substring(9));
    message.delete();
  }

  /* account info
  if (message.content.startsWith('$as uinfo')) {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    getAvatar(message);
    // TODO add more info + embed
  }//*/

  // generates and sends avatar embeds
  if (message.content.startsWith(prefix + 'avatar')) {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    var userArray = message.mentions.users.array();
    var dist = {
      length: userArray.length,
      curr: 1
    };
    if (userArray.length < 1)
      userArray.push(message.author);
    userArray.forEach(function(user) {
      message.channel.sendEmbed(avatarEmbed(message, user, dist));
    });
  }

  // purge selected number of messages
  // TODO fix role perms
  if (message.content.startsWith(prefix + 'purge') && (message.member.roles.exists('name','Aggressive') || message.member.roles.exists('name','Mod'))) {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    try {
      message.channel.bulkDelete(parseInt(message.content.substring(10), 10) + 1);
    } catch(e) {
      console.log(e);
    }
    message.channel.sendMessage(`${message.author} deleted ${parseInt(message.content.substring(10), 10)} messages.`)
  }

  // returns Asuna-tan's uptime
  if(message.content === prefix + 'uptime') {
    var seconds = process.uptime();
    message.channel.sendMessage(`Uptime: ${pad(Math.floor(seconds / (60*60)),2)}:${pad(Math.floor(seconds % (60*60) / 60),2)}:${pad(Math.floor(seconds % 60),2)}`);
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
  }

  // lists commands
  // TODO clean up + format + maintain
  if(message.content === prefix + 'cmds') {
    console.log(`${message.author}(${message.author.username}): ${message.content}.`);
    message.channel.sendEmbed(new Discord.RichEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL)
      .setColor(message.guild.member(client.user).highestRole.color)
      .setTimestamp()
      .addField('User Commands', `**ping**  --  pong!
      **${prefix} uptime**  --  Display's ${client.user.username}'s uptime.
      **${prefix} avatar** <user(s)>  --  Diplays mentioned user's avatar. Show's your own if blank.
      **${prefix} uinfo**  --  TODO
      **${prefix} cmds**  --  Lists all commands.`)
            .addField('Admin Commands', `**${prefix} echo <Input>**  -- Echos input and purges parent message.
      **${prefix} purge <#>**  --  Deletes given number of messages, must be greater than one.
      **${prefix} kill**  -- Kill's bot process.`)
      //.addField('Responses', 'TODO', true);
    );
  }
});

// on <guildMemberAdd> event
client.on('guildMemberAdd', guildMember => {
  if(config.welcome) {
    console.log(`${guildMember}(${guildMember.username} joined ${guildMember.guild.name})`)
    guildMember.guild.defaultChannel.sendMessage(`Welcome to ${guildMember.guild.name}, ${guildMember}!`)
  }
});

// on <guildMemberRemove> event
client.on('guildMemberRemove', guildMember => {
  if(config.goodbye) {
    console.log(`${guildMember}(${guildMember.username} left ${guildMember.guild.name})`)
    guildMember.guild.defaultChannel.sendMessage(`${guildMember} left ${guildMember.guild.name} :( \n Come back soon!`)
  }
});

// builds avatar embed
function avatarEmbed(message, user, counts) {
  var embed = new Discord.RichEmbed()
    .setTitle(`${user.username}'s avatar as of this moment.`)
    .setColor(message.guild.member(client.user).highestRole.color)
    .setFooter(`This is ${counts.curr++} of ${counts.length} requests.`, client.user.displayAvatarURL)
    .setImage(user.displayAvatarURL)
    .setTimestamp()
    .setURL(client.user.displayAvatarURL);
  return embed;
}

// pads numbers for $as uptime
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

client.login(config.botToken);
