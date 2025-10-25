import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from "file-type";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let teks = text.split('|');
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw `Balas Gambar Dengan Perintah\n\n${usedPrefix + command} <${teks[0] ? teks[0] : 'teks atas'}>|<${teks[1] ? teks[1] : 'teks bawah'}>`;
  if (!/image\/(jpe?g|png)/.test(mime)) throw `_*Mime ${mime} tidak didukung!*_`;
  let img = await q.download();
  let url = await tmpFile(img);
  let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(teks[0] ? teks[0] : ' ')}/${encodeURIComponent(teks[1] ? teks[1] : ' ')}.png?background=${encodeURIComponent(url)}`;
  conn.toSticker(m.chat, meme, m, { command: 'smeme' });
};

handler.help = ['smeme'];
handler.tags = ['tools'];
handler.command = /^(smeme)$/i;

export default handler;

const tmpFile = (buffer) => {
  return new Promise(async (resolve, reject) => {
    const { ext, mime } = await fileTypeFromBuffer(buffer);
    const form = new FormData();
    form.append("file", buffer, {
      filename: new Date() * 1 + "." + ext,
      contentType: mime,
    });

    axios
      .post("https://tmpfiles.org/api/v1/upload", form, {
        headers: {
          ...form.getHeaders(),
        },
      })
      .then((response) => {
        const url = new URL(response.data.data.url);
        resolve("https://tmpfiles.org/dl" + url.pathname);
      })
      .catch((error) => {
        resolve(error?.response);
      });
  });
};
