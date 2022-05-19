"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = __importDefault(require("../db/firestore"));
const replyInChannel_1 = require("../actions/replyInChannel");
const getTimezoneFromLocation = require(`../actions/getTimezoneFromLocation`);
const { getUserInGuildFromId, getLightEmoji, currentTimeAt, getLabelFromUser, standardizeTimezoneName, } = require(`../scripts/commonFunctions`);
const allCommands = require(`./index`);
module.exports = {
    regex(settings) {
        return new RegExp(`^${settings.prefix}(?:set|s)(?!user) (.*)$`, `gi`);
    },
    async action({ msg, settings, match, client }) {
        if (!match[1])
            return (0, replyInChannel_1.send)(msg, `Use this command in the format ${settings.prefix}set <city or country name> to set your timezone.`, false, settings);
        // admin accidentally used this command to try to set someone
        const hasAt = match[1].indexOf(`<@`) >= 0;
        const hasSpaceAfterAt = match[1].lastIndexOf(` `) > hasAt;
        if (hasAt && hasSpaceAfterAt) {
            const commandRegex = new RegExp(`${settings.prefix}[^ ]* `, `gi`);
            msg.content = msg.content.replace(commandRegex, `${settings.prefix}setuser `);
            return allCommands(msg, settings, client);
        }
        else if (hasAt)
            return (0, replyInChannel_1.send)(msg, `Use this command in the format ${settings.prefix}set <city or country name> to set your timezone.`, false, settings);
        console.log(`${msg.guild
            ? msg.guild.name.substring(0, 25).padEnd(25, ` `)
            : `Private Message`}${msg.guild ? ` (${msg.guild.id})` : ``} - ${msg.author.username} > set to ${match[1]}`);
        const foundTimezone = await getTimezoneFromLocation(match[1]);
        if (!foundTimezone)
            return (0, replyInChannel_1.send)(msg, `Sorry, I couldn't find a timezone for ${match[1]}.`, false, settings);
        await firestore_1.default.updateUserInGuild({
            guildId: msg.guild.id,
            guildName: msg.guild.name,
            userId: msg.author.id,
            updatedInfo: foundTimezone,
        });
        const authorInGuild = await getUserInGuildFromId(msg.guild, msg.author.id);
        (0, replyInChannel_1.send)(msg, `Timezone for ${getLabelFromUser(authorInGuild)} set to ${standardizeTimezoneName(foundTimezone.timezoneName)}. (${getLightEmoji(foundTimezone.location)}${currentTimeAt(foundTimezone.location, false, settings.format24)})` +
            (match[1].length <= 4 ||
                (match[1].length <= 7 &&
                    match[1].indexOf(`+`) > -1) ||
                (match[1].length <= 7 &&
                    match[1].indexOf(`-`) > -1) ||
                match[1].toLowerCase().indexOf(` time`) > -1
                ? `\nBy the way, location names always work better than timezone codes/names!`
                : ``), false, settings);
    },
};
