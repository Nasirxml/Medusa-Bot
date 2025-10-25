import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text }) => {
    conn.akira = conn.akira || {};

    if (!text) throw `*• Example:* .chatsesi *[on/off]*`;

    if (text === "on") {
        conn.akira[m.sender] = {
            pesan: [],
        };
        m.reply("[ ✓ ] Success create session chat");
    } else if (text === "off") {
        delete conn.akira[m.sender];
        m.reply("[ ✓ ] Success delete session chat");
    }
};

handler.before = async (m, { conn }) => {
    conn.akira = conn.akira || {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!conn.akira[m.sender]) return;

    if (m.text.startsWith(".") || m.text.startsWith("#") || m.text.startsWith("!") || m.text.startsWith("/") || m.text.startsWith("\\/")) {
        return;
    }

    if (conn.akira[m.sender] && m.text) {
        await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } });
        try {
            let aiName = "medusa";
            let userName = m.text ? await conn.getName(m.sender) : 'user';
            let messages = [
                ...conn.akira[m.sender].pesan,
                {
                    "role": "system",
                    "content": `Anda adalah asisten yang cerdas. Selalu memberikan solusi terbaik kepada semua orang. Menggunakan bahasa gaul dan keren. Nama Anda ${aiName}, asisten yang cerdas.`
                },
                {
                    "role": "assistant",
                    "content": `Kamu adalah ${aiName}, asisten AI yang keren dan kece. Gunakan bahasa gaul seperti gw untuk pengganti kata aku dan lu untuk pengganti kata kamu. Kamu harus berbicara layaknya orang dewasa dengan pengetahuan yang luas. Bersikaplah cuek terhadap semua orang. Selalu gunakan emoji di setiap kalimat yang tepat.`
                },
                { "role": "user", "content": m.text }
            ];
            let res = await openai(m.text); // Menggunakan fungsi openai yang sudah ada
            await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } });
            m.reply(res);
            conn.akira[m.sender].pesan = messages;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }
};

handler.command = ["chatsesi"];
handler.tags = ["ai"];
handler.help = ["chatsesi"].map((a) => a + " *[on/off]*");
handler.premium = true;

export default handler;

function openai(messages) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!Array.isArray(messages)) {
                messages = [messages];
            }

            const url = 'https://chatsandbox.com/api/chat';
            const requestData = {
                messages: messages,
                character: 'openai'
            };

            const headers = {
                "Content-Type": "application/json"
            };

            const response = await axios.post(url, requestData, { headers });

            if (response.status === 200 && response.data) {
                resolve(response.data);
            } else {
                reject(new Error('Failed to get a valid response'));
            }
        } catch (error) {
            reject(error);
        }
    });
}
