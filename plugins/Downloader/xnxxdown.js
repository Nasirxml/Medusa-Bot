import fetch from 'node-fetch'

let handler = async (m, {
 text,
 setReply,
 usedPrefix, 
 command
 }) => {
if (!text) return setReply(`Masukkan Query Link!`)
 try {
let anu = await fetch(`https://api.botcahx.eu.org/api/download/xnxxdl?url=${text}&apikey=lanagalau`)
let hasil = await anu.json() 

conn.sendMessage(m.chat, { video: { url: hasil.result.url }, fileName: 'xnxx.mp4', mimetype: 'video/mp4' }, { quoted: m })
 } catch (e) {
 throw `*Server error!*`
 }
}
handler.command = handler.help = ['xnxxdown'];
handler.tags = ['downloader'];
handler.register = true;

export default handler;
