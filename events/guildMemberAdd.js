module.exports = async (client, member) => {
  member.guild.channels.cache.get("717712237497679977").send({
    embed: {
      color: 3447003,
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL(),
        text: member.guild.name,
      },
      author: {
        name: member.user.username,
        icon_url: member.user.avatarURL(),
      },
      fields: [
        {
          name: "Seja bemvindo(a)",
          value: "Leia as <#> para não tomar kick",
        },
      ],

      description: `seja bem vindo ${member}`,
    },
  });
};
