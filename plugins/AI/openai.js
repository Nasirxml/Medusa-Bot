import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh: ${usedPrefix + command} hai, apa kabar?`;

    try {
        let res = await openai(text);
        
        conn.reply(m.chat, res, m);
        
    } catch (e) {
        throw e;
    }
}

handler.command = handler.help = ["openai"];
handler.tags = ["ai"];
handler.limit = true;

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
