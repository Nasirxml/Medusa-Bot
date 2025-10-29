let handler = async (m, { conn, usedPrefix, command }) => {    
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        
        if (!mime) throw `Balas sticker dengan perintah\n\n${usedPrefix + command}`;
        if (!/webp/.test(mime)) throw `_*Mime ${mime} tidak didukung!*_`;
        m.reply('Tunggu sebentar...');
        let img = await q.download();
        await conn.sendMessage(m.chat, { image: img, mimetype: 'image/png' },{ quoted: m });
};

handler.help = ["toimg"];
handler.tags = ["tools"];
handler.command = ["toimg", "toimage"];

export default handler;
