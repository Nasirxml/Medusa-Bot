import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh: ${usedPrefix + command} hai, apa kabar?`;

    try {
        const res = await axios.get(`https://api.nasirxml.my.id/api/ai/perplexity?text=${encodeURIComponent(text)}&apikey=nasirxml00890`);
        let result = res.data;
        
        conn.reply(m.chat, result.text, m);
        
    } catch (e) {
        throw e;
    }
}

handler.command = handler.help = ["ai"];
handler.tags = ["ai"];
handler.limit = true;

export default handler;