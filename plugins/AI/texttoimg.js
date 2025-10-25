import axios from "axios";

let handler = async (m, { q, conn, args, usedPrefix, command }) => {
  try {
    if (!q) return m.reply(`Maukan perintah nama/atau apalah`);
    m.reply(wait)
    let res = await axios.get(`https://imgen.duck.mom/prompt/${encodeURIComponent(q)}`, { responseType: 'arraybuffer' });
    let foto = Buffer.from(res.data, 'binary');
    await conn.sendMessage(
      m.chat,
      { image: foto, caption: "Nih..." },
      { quoted: m }
    );
  } catch (err) {
    throw `${err}`;
  }
};
handler.help = ["chatgpt"];
handler.tags = ["internet", "bard", "gpt"];
handler.command = ["texttoimg", "text2img"];

export default handler;
