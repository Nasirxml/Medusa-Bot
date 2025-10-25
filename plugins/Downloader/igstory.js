import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, args, command }) => {
    if (!text) return m.reply(`*Contoh:* ${usedPrefix + command} url`);
    
    m.reply(wait);

const res = await axios.get(`https://api.nasirxml.my.id/api/dl/igstory?url=${encodeURIComponent(text)}&apikey=nasirxml00890`);
const anu = res.data;

conn.sendFile(m.chat, anu.data[0].url, '', 'Ini Dia Kak', m);
};

handler.help = ['instagramstory']
handler.tags = ['downloader'];
handler.command = /^(igstory|instagramstory)$/i;

export default handler;