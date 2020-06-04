module.exports = {
  name: "help",
  description: "Comandos de ajuda",
  execute(message, args) {
    message.content === "!help";

    message.reply(`!play [musica]
                   !skip = pula musica
                   !stop = para a musica 
                   !oi 
                   !sac
                   Gostaria de um comando, manda Dm a moderação`);
  },
};
