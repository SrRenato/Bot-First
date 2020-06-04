const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core"); // biblioteca de musica!

const queue = new Map(); // lista musica

const bot = new Discord.Client();

const fs = require("fs");
bot.commands = new Discord.Collection();

// SINCRONIZA COM A PASTA COMMANDS
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  bot.commands.set(command.name, command);
}
// COMANDOS
bot.on("message", (message) => {
  let args = message.content.substring(prefix.length).split(" ");

  switch (args[0]) {
    case "oi":
      bot.commands.get("oi").execute(message, args);
      break;
    case "help":
      bot.commands.get("help").execute(message, args);
      break;
    case "sac":
      bot.commands.get("sac").execute(message, args);
      break;
  }
});
// STATUS DO BOT
bot.once("ready", () => {
  console.log("Ready!");
});

bot.once("reconnecting", () => {
  console.log("Reconnecting!");
});

bot.once("disconnect", () => {
  console.log("Disconnect!");
});

//BOT DE MUSICA

bot.on("message", async (message) => {
  if (message.author.bot) return; // verifica se o autor da mensagem e o nosso bot!!
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };
    // Setting the queue using our contract
    queue.set(message.guild.id, queueContruct);
    // Pushing the song to our songs array
    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;

      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Você precisa estar em um canal de voz para parar a música"
    );
  if (!serverQueue)
    return message.channel.send("Não há música que eu possa pular");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Você precisa estar em um canal de voz para parar a música!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

bot.login(token);
