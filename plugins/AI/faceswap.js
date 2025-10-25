import fetch from "node-fetch";

let handler = async (m, { usedPrefix, command, text, conn }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix + command} url1, url2`);

    let [url1, url2] = text.split(',').map(url => url.trim());

    if (!url1 || !url2) return m.reply("Pastikan Anda memberikan dua URL yang valid!");

    m.reply("Tunggu beberapa menit untuk proses faceswap");

    try {
        let response = await fetch(`https://api.nasirxml.my.id/ai/faceswap?targetUrl=${encodeURIComponent(url1)}&sourceUrl=${encodeURIComponent(url2)}`);
        let swap = await response.json();

        if (swap.result) {
            let imgUrl = swap.result;

            conn.sendMessage(m.chat, { image: { url: imgUrl }, mimetype: 'image/jpeg' }, { quoted: m });
        } else {
            m.reply("Gagal mendapatkan hasil faceswap.");
        }
    } catch (e) {
        console.error(e);
        m.reply("Terjadi kesalahan saat memproses faceswap.");
    }
};

handler.help = handler.command = ["faceswap"];
handler.tags = ["ai"];

export default handler;
