import axios from 'axios'
let handler = async (m, {
command,
usedPrefix,
conn,
text,
args
}) => {
if (!text) return m.reply('> ✨Hallo ada yang bisa saya bantu?')
try {
const result = await gemini(text);
const {
key
} = await conn.sendMessage(m.chat, {
image: {
url: 'https://telegra.ph/file/e7bd058e0306e44c99c0f.jpg'
},
caption: wait
}, {
quoted: m,
mentions: [m.sender]
})
setTimeout(async () => {
await conn.sendMessage(m.chat, {
image: {
url: 'https://telegra.ph/file/e7bd058e0306e44c99c0f.jpg'
},
caption: `\`✨Bard Ai by Medusa\`\n\n${result.reply}`,
edit: key
}, {
quoted: m,
mentions: [m.sender]
})
}, 500);
} catch (e) {
throw e
}
}
handler.help = ["bard"];
handler.tags = ["ai"];
handler.command = /^(bard(ai)?)$/i;
handler.limit = true;
handler.register = true;
export default handler;
async function gemini(txt) {
try {
const { data } = await axios.get(`https://hercai.onrender.com/gemini/hercai?question=${encodeURIComponent(txt)}`, {
headers: {
"content-type": "application/json",
},
})
return data;
} catch (e) {
console.log(e)
}
                       }
