import axios from "axios";
import cheerio from "cheerio";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let wr = `Masukkan URL Capcut!\n\nContoh:\n${usedPrefix + command} https://www.capcut.com/t/Zs8F2jgx7`;
    if (!text) return m.reply(wr);
    if (!/www\.capcut/i.test(text)) return m.reply('Invalid URL!');

    m.reply('Tunggu sebentar...');

    try {
        let res = await step2down.dl(text);

        if (res && res.medias) {
            let data = res.medias;

            if (data.length > 0) {
                await conn.sendMessage(m.chat, { video: { url: data[0].url }, mimetype: 'video/mp4' }, { quoted: m });
            } else {
                m.reply('Tidak ada media yang ditemukan!');
            }
        } else {
            m.reply('Data tidak ditemukan dalam respons!');
        }

    } catch (e) {
        m.reply(`Terjadi kesalahan: ${e.message}`);
    }
}

handler.help = ['capcut']
handler.tags = ['downloader'];
handler.command = /^capcut(dl)?$/i;

export default handler;

const step2down = {
    dl: async (link) => {
        try {
            const { data: api } = await axios.get('https://steptodown.com/');
            const token = cheerio.load(api)('#token').val();

            const { data } = await axios.post('https://steptodown.com/wp-json/aio-dl/video-data/', new URLSearchParams({ url: link, token }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Postify/1.0.0'
                }
            });
            return data;
        } catch (error) {
            return { error: error.response?.data || error.message };
        }
    }
};
