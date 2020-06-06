exports.run = async (client, message, args) => {
  message.delete();
  if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
    return message.reply("⚠️ Comando apenas para admins!");

  const deleteCount = parseInt(args[0], 10);
  if (!deleteCount || deleteCount < 1 || deleteCount > 99)
    return message.channel.send(
      "um número de até 99 mensagens a serem excluídas"
    );
  const fetched = await message.channel.messages.fetch({
    limit: deleteCount + 1,
  });
  message.channel.bulkDelete(fetched);
  message.channel.send(`${args[0]} mensagens limpas nesse chat`);
};
//O bot apaga apenas mensagens de até 2 semanas (pode ser contornado com um código mais completo).
