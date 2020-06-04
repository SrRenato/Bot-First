module.exports = {
  name: "oi",
  description: "Mensagem de boas vindas",
  execute(message, args) {
    message.channel.send(`Oi, tudo bem ? `);
  },
};
