export async function before(m, { conn }) {
if (m.key.remoteJid != 'status@broadcast') return;
const setBot = db.data.settings.settingbot || {}
if(setBot.viewStory === undefined) setBot.viewStory = false
if (!setBot.viewStory) return
await conn.sendMessage(m.key.remoteJid, { react: { text: await emoji(), key:  m.key } }, { statusJidList: [m.key.participant, m.sender] })
}
async function emoji() {
let emo = [
"😀", "😂", "😍", "🥺", "😎", "😢", "😡", "😱", "👍", "👎",
"👏", "💪", "🙏", "🎉", "🎂", "🌟", "🌈", "🔥", "🍎", "🍕",
"🍔", "🍟", "🍣", "🍜", "🎸", "🎧", "🎤", "🎬", "🏆", "⚽",
"🏀", "🏈", "🏊", "🚴", "🚗", "✈", "🚀", "🚂", "🏠", "🌍"
];
    
let randomIndex = Math.floor(Math.random() * emo.length);
return emo[randomIndex];
}
