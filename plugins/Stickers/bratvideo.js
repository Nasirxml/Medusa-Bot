import fs from 'fs';
import WSF from 'wa-sticker-formatter';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
    text = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.quoted && m.quoted.caption ? m.quoted.caption : m.quoted && m.quoted.description ? m.quoted.description : '';
    if (!text) throw `*• Example :* ${usedPrefix + command} *[text]*`;

    let res = `https://nasirxml-brat-api.hf.space/bratvid?text=${encodeURIComponent(text)}`;

    try {
        await conn.toSticker(m.chat, res, m);
    } catch (e) {
        console.log(e);
        await m.reply('eror kak T-T');
    }
};

handler.command = handler.help = ['bratvid'];
handler.tags = ['sticker'];
export default handler;