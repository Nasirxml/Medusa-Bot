import fs from 'fs';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
    // ambil teks dari argumen atau quoted
    text =
        text ||
        (m.quoted?.text || m.quoted?.caption || m.quoted?.description || '');

    if (!text) throw `*• Example :* ${usedPrefix + command} *[text] | [background] | [color]*\n\nContoh:\n${usedPrefix + command} Hello | yellow | red`;

    // jika text mengandung pemisah '|', kita pecah
    const parts = text.split('|').map(s => s.trim());
    const mainText = parts[0];
    const background = parts[1] || 'white';
    const color = parts[2] || 'black';

    const res = `https://nasirxml-brat-api.hf.space/brat?text=${encodeURIComponent(mainText)}&background=${encodeURIComponent(background)}&color=${encodeURIComponent(color)}`;

    try {
        await conn.toSticker(m.chat, res, m);
    } catch (e) {
        console.error(e);
        await m.reply('Error kak T-T');
    }
};

handler.command = handler.help = ['brat'];
handler.tags = ['sticker'];

export default handler;