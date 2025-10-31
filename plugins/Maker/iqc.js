let handler = async (m, { conn, text, usedPrefix, command }) => {
 
if (!text) return m.reply(`${usedPrefix + command} Hello, how are you?`);

    m.reply(wait);
    
  const Url = `https://iqc-261878ade392.herokuapp.com/generate?messageText=${encodeURIComponent(text)}`
  conn.sendMessage(
    m.chat,
    { image: { url: Url }, caption: "Nih" },
    { quoted: m }
  );
};

handler.tags = ["maker"];
handler.command = ["iqc"];
export default handler;
