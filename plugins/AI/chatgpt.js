import axios from "axios";


let handler = async (m, {
    conn,
    usedPrefix,
    command,
    text
}) => {
    if (!text)
        throw `Apa yang pengen kamu tanyain?\n\nContoh: ${
 usedPrefix + command
 } siapakah presiden yang pernah menjual pulau dan satelit`;

    try {
        await m.reply("_Tunggu sebentar kak..._")
        let json = await ai(text);

        await m.reply(`\> ✨${json}`).then(() => {
            
        })
    } catch (e) {
        await m.reply("error abangkuhh")
    }
};

handler.help = ["chatgpt <teks>"];
handler.tags = ["ai"];
handler.command = /^(chatgpt)$/i;
handler.limit = true;

export default handler;

const IP = () => {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
};

async function ai(text) {
    try {
        const {
            data: res
        } = await axios.post("https://chatgpt4online.org/wp-json/mwai/v1/start_session", {}, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                "x-forwarded-for": await IP(),
                "X-Real-IP": await IP()
            }
        });

        const url = 'https://chatgpt4online.org/wp-json/mwai-ui/v1/chats/submit';
        const data = {
            botId: "chatbot-qm966k",
            customId: null,
            session: "N/A",
            messages: [{
                role: "user",
                content: text
            }],
            newMessage: text,
            stream: false
        };

        const headers = {
            'Content-Type': 'application/json',
            'X-WP-Nonce': res.restNonce,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            "x-forwarded-for": await IP(),
            "X-Real-IP": await IP(),
            'Referer': 'https://chatgpt4online.org/'
        };

        // Send chat message
        const response = await axios.post(url, data, {
            headers: headers
        });

        if (response.status === 200) {
            return response.data.reply;
        } else {
            throw response.statusText;
        }
    } catch (error) {
        throw error;
    }
    }
