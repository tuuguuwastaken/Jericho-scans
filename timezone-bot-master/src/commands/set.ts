import db from '../db/firestore'
import { send } from '../actions/replyInChannel'
import type { ActionProps } from '../../@types/command'
import getTimezoneFromLocation from '../actions/getTimezoneFromLocation'
import {
  getUserInGuildFromId,
  getLightEmoji,
  currentTimeAt,
  getLabelFromUser,
  standardizeTimezoneName,
} from '../scripts/commonFunctions'
const allCommands = require(`./index`)

export default {
  regex(settings: Settings) {
    return new RegExp(
      `^${settings.prefix}(?:set|s)(?!user) (.*)$`,
      `gi`,
    )
  },
  async action({
    msg,
    settings,
    match,
    client,
  }: ActionProps) {
    if (!match[1])
      return send(
        msg,
        `Use this command in the format ${settings.prefix}set <city or country name> to set your timezone.`,
        false,
        settings,
      )

    // admin accidentally used this command to try to set someone
    let hasAt = match[1].indexOf(`<@`)
    if (hasAt !== -1) {
      const hasSpaceAfterAt =
        match[1].lastIndexOf(` `) > hasAt
      if (hasAt && hasSpaceAfterAt) {
        const commandRegex = new RegExp(
          `${settings.prefix}[^ ]* `,
          `gi`,
        )
        msg.content = msg.content.replace(
          commandRegex,
          `${settings.prefix}setuser `,
        )
        return allCommands(msg, settings, client)
      } else if (hasAt)
        return send(
          msg,
          `Use this command in the format ${settings.prefix}set <city or country name> to set your timezone.`,
          false,
          settings,
        )
    }

    console.log(
      `${
        msg.guild?.name
          ? msg.guild.name.substring(0, 25).padEnd(25, ` `)
          : `Private Message`
      }${msg.guild ? ` (${msg.guild.id})` : ``} - ${
        msg.author.username
      } > set to ${match[1]}`,
    )

    const foundTimezone = await getTimezoneFromLocation(
      match[1],
    )
    if (!foundTimezone)
      return send(
        msg,
        `Sorry, I couldn't find a timezone for ${match[1]}.`,
        false,
        settings,
      )
    await db.updateUserInGuild({
      guildId: msg.guild?.id,
      guildName: msg.guild?.name,
      userId: msg.author.id,
      updatedInfo: foundTimezone,
    })
    const authorInGuild = await getUserInGuildFromId(
      msg.guild || undefined,
      msg.author.id,
    )
    if (authorInGuild)
      send(
        msg,
        `Timezone for ${getLabelFromUser(
          authorInGuild,
        )} set to ${standardizeTimezoneName(
          foundTimezone.timezoneName,
        )}. (${getLightEmoji(
          foundTimezone.location,
        )}${currentTimeAt(
          foundTimezone.location,
          false,
          Boolean(settings.format24),
        )})` +
          (match[1].length <= 4 ||
          (match[1].length <= 7 &&
            match[1].indexOf(`+`) > -1) ||
          (match[1].length <= 7 &&
            match[1].indexOf(`-`) > -1) ||
          match[1].toLowerCase().indexOf(` time`) > -1
            ? `\nBy the way, location names always work better than timezone codes/names!`
            : ``),
        false,
        settings,
      )
  },
}
