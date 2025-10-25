import fetch from 'node-fetch';

let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) throw 'Masukkan lirik atau judulnya';
    m.reply(wait);

    try {
        let response = await fetch(`https://api.nyxs.pw/tools/lirik?title=${encodeURIComponent(text)}`);
        
        if (!response.ok) throw new Error('Gagal menghubungi API');

        let data = await response.json();
        
        if (!data.result) throw new Error('Lirik tidak ditemukan');

        let bjir = data.result;
        await m.reply(bjir);
    } catch (e) {
        m.reply(`Error: ${e.message}`);
    }
};

handler.help = handler.command = ['lirik', 'lyric'];
handler.tags = ['tools'];

export default handler;
