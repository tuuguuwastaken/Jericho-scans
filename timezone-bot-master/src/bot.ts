// todo
/*
save server counts/dates
set times for non-users
*/

// test realm is 605053799404666880
// https://discord.com/api/oauth2/authorize?client_id=723017262369472603&permissions=75840&scope=bot

require(`dotenv`).config()

import * as Discord from 'discord.js-light'

const client: Discord.Client = new Discord.Client({
  makeCache: Discord.Options.cacheWithLimits({
    MessageManager: 0,
    GuildManager: Infinity, // client.guilds
    GuildMemberManager: 301, // guild.members
    PresenceManager: 302, // guild.presences
    RoleManager: 303, // guild.roles
    ThreadManager: 0, // channel.threads
    ThreadMemberManager: 0, // threadchannel.members
    UserManager: {
      maxSize: 0,
      keepOverLimit: (value, key, collection) =>
        value.id === client.user?.id,
    }, // client.users
    ChannelManager: 304,
    GuildChannelManager: 0,
    ApplicationCommandManager: 0, // guild.commands
    BaseGuildEmojiManager: 0, // guild.emojis
    GuildBanManager: 0, // guild.bans
    GuildInviteManager: 0, // guild.invites
    GuildStickerManager: 0, // guild.stickers
    PermissionOverwriteManager: 0, // channel.permissionOverwrites
    ReactionManager: 0, // message.reactions
    ReactionUserManager: 0, // reaction.users
    StageInstanceManager: 0, // guild.stageInstances
    VoiceStateManager: 0, // guild.voiceStates
  }),
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
  ],
})

import addedToServer from './events/addedToServer'
import kickedFromServer from './events/kickedFromServer'
import privateMessage from './events/receivePrivateMessage'
import guildMessage from './events/receiveGuildMessage'
import otherMemberLeaveServer from './events/otherMemberLeaveServer'

const launchTime = Date.now()
let messagesScannedSinceLastAnnounce = 0
const announceTimeSpanInHours = 0.5
setInterval(async () => {
  if (messagesScannedSinceLastAnnounce > 0) {
    console.log(
      `. . . . ${messagesScannedSinceLastAnnounce} messages watched in ${announceTimeSpanInHours} hours. (Running for ${Math.round(
        (Date.now() - launchTime) / 60 / 60 / 1000,
      )} hours in ${
        [...(await client.guilds.fetch()).keys()].length
      } guilds)`,
    )
  }
  messagesScannedSinceLastAnnounce = 0
}, Math.round(announceTimeSpanInHours * 60 * 60 * 1000))

client.on(`error`, (e) =>
  console.log(`Discord.js error:`, e.message),
)
client.on(`ready`, async () => {
  console.log(
    `Logged in as ${client.user?.tag} in a shard`,
    // ${
    //   [...(await client.guilds.fetch()).keys()].length
    // } guilds`,
  )
  client.user?.setActivity(`t!info`, { type: `LISTENING` })
})

client.on(`messageCreate`, async (msg) => {
  messagesScannedSinceLastAnnounce++
  if (
    !msg.author ||
    msg.author.id === process.env.BOT_ID ||
    msg.author.bot
  )
    return
  if (msg.guild && !msg.guild.available) return
  if (!msg.guild) return privateMessage(msg)
  return guildMessage(msg, client)
})

// added to a server
client.on(`guildCreate`, (guild: Discord.Guild) =>
  addedToServer(guild),
)

// removed from a server
client.on(`guildDelete`, (guild: Discord.Guild) =>
  kickedFromServer(guild),
)

// other user leaves a guild
client.on(
  `guildMemberRemove`,
  (
    member:
      | Discord.GuildMember
      | Discord.PartialGuildMember,
  ) => otherMemberLeaveServer(member),
)

client.login(process.env.DISCORD_TOKEN)
