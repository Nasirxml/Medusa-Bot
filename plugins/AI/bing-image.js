import axios from "axios";

let handler = async (m, { conn, text }) => {
  if (!text) throw "Input prompt!";

  try {
    conn.reply(
      m.chat,
      `_Please wait! This process may take up to several minutes._`,
      m,
    );
    const response = await axios.get(
      `https://anabot.my.id/api/ai/bingAi?prompt=${encodeURIComponent(text)}&apikey=DitzOfc`,
    );

    // Menangani respons dengan benar
    const result = response.data;

    for (let p of result.image) {
      conn.sendFile(m.chat, p, null, `*Prompt:* ${text}`, m);
    }
  } catch (err) {
    console.error(err);
    throw "Terjadi kesalahan saat mengambil data dari server AI Bing.";
  }
};

handler.command = handler.help = ["bing-ai2", "bing-img"];
handler.premium = false;

export default handler;
