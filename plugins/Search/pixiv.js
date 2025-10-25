import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`• Contoh: ${usedPrefix + command} cailin`);

    try {
        m.reply(mess.wait);
        let response = await fetch(`https://api.ryzendesu.vip/api/search/pixiv?query=${encodeURIComponent(text)}`);
        let data = await response.json();

        if (data.Media && data.Media.length > 0) {
            for (let i of data.Media) {
                await sleep(3000);
                conn.sendMessage(m.chat, { image: { url: i }, caption: `*Result from :* ${command}` });
            }
        } else {
            m.reply('No results found.');
        }
    } catch (e) {
        console.error(e);
        m.reply('An error occurred while fetching data.');
    }
};

handler.help = ["pixiv"];
handler.tags = ["search"];
handler.command = /^(pixiv)$/i;

export default handler;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
