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
url: 'https://telegra.ph/file/e628941df62f8d0f8c5aa.png'
},
caption: wait
}, {
quoted: m,
mentions: [m.sender]
})
setTimeout(async () => {
await conn.sendMessage(m.chat, {
image: {
url: 'https://telegra.ph/file/e628941df62f8d0f8c5aa.png'
},
caption: `\`✨Gemini Ai by Medusa\`\n\n${result.reply}`,
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
handler.help = ["gemini"]
handler.tags = ["ai"]
handler.command = /^(gemini(ai)?)$/i
handler.register = true
export default handler
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
