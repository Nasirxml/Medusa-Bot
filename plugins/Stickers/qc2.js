import axios from 'axios';
import fetch from 'node-fetch';
import FormData from 'form-data';
import {
    fileTypeFromBuffer
} from 'file-type';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  const { mtype } = m;
  
  if (!text) return m.reply('Teksnya Mana Sayang?');
  
  let args = text.split('--');
  let quoteText = args[0].trim();
  let bgColor = args[1] ? args[1].trim().toLowerCase() : '#ffffff';

  // Validate color input
  const colors = {
  "merah": "#FF0000",
    "hijau": "#008000",
    "biru": "#0000FF",
    "kuning": "#FFFF00",
    "putih": "#FFFFFF",
    "hitam": "#000000",
    "orange": "#FFA500",
    "pink": "#FFC0CB",
    "biru_muda": "#ADD8E6",
    "ungu": "#800080",
    "coklat": "#964B00",
    "abu_abu": "#808080",
    "coklat_muda": "#F5DEB3",
    'default': '#ffffff'
  }, scale = 3
  bgColor = colors[bgColor] || colors['default'];

  let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => "https://telegra.ph/file/89c1638d9620584e6e140.png");

  if (m.quoted) {
    if (q.mtype == 'extendedTextMessage') {
      conn.sendMessage(m.chat, {
        react: {
          text: "🕛",
          key: m.key,
        },
      });
      let objj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": bgColor,
        "width": 512,
        "height": 768,
        scale,
        "messages": [{
          "entities": [],
          "avatar": true,
          "from": {
            "id": 1,
            "name": m.name,
            "photo": { "url": pp }
          },
          "text": quoteText,
          "replyMessage": {
            "name": await conn.getName(m.quoted.sender),
            "text": m.quoted.text || '',
            "chatId": m.chat.split('@')[0],
          }
        }]
      };

      const bufferr = await Quotly(objj);

      conn.toSticker(m.chat, buffer, m);
      conn.sendMessage(m.chat, {
        react: {
          text: "✅",
          key: m.key,
        },
      });
    } else if (q.mtype == 'stickerMessage' || q.mtype == 'imageMessage') {
      let img = await q.download();

      conn.sendMessage(m.chat, {
        react: {
          text: "🕛",
          key: m.key,
        },
      });
      let up;
      if (/image/g.test(mime)) {
        up = await tourl(img);
      } else ''

      let obj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": bgColor,
        "width": 512,
        "height": 768,
        scale,
        "messages": [{
          "entities": [],
          "media": { "url": up },
          "avatar": true,
          "from": {
            "id": 1,
            "name": m.name,
            "photo": { "url": pp }
          },
          "text": quoteText,
          "replyMessage": {}
        }]
      };

      const buffer = await Quotly(obj);

      conn.toSticker(m.chat, buffer, m);
      conn.sendMessage(m.chat, {
        react: {
          text: "✅",
          key: m.key,
        },
      });
    }
  } else {
    conn.sendMessage(m.chat, {
      react: {
        text: "🕛",
        key: m.key,
      },
    });
    let obj2 = {
      "type": "quote",
      "format": "png",
      "backgroundColor": bgColor,
      "width": 512,
      "height": 768,
      scale,
      "messages": [{
        "entities": [],
        "avatar": true,
        "from": {
          "id": 1,
          "name": m.name,
          "photo": { "url": pp }
        },
        "text": quoteText,
        "replyMessage": {}
      }]
    };

    const buffer = await Quotly(obj2);

    conn.toSticker(m.chat, buffer, '', m);
    conn.sendMessage(m.chat, {
      react: {
        text: "✅",
        key: m.key,
      },
    });
  }
};

handler.help = ['qc2'];
handler.tags = ['sticker'];
handler.command = /^(qc2)$/i;
handler.limit = true;

export default handler;

async function Quotly(obj) {
  let json;

  try {
    json = await axios.post(
      "https://bot.lyo.su/quote/generate",
      obj,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (e) {
    return e;
  }

  const results = json.data.result.image;
  const buffer = Buffer.from(results, "base64");
  return buffer;
}

async function tourl(buffer) {
    let {
        ext
    } = await fileTypeFromBuffer(buffer);
    let bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, "file." + ext);
    bodyForm.append("reqtype", "fileupload");

    let res = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: bodyForm,
    });

    let data = await res.text();
    return data;
    }
