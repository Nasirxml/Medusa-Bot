import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import fetch from 'node-fetch';
import cheerio from "cheerio";

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw 'No media found';
  let media = await q.download();

  let link = await tmpFile(media);
  let link3 = await catbox(media);
  let link4 = await top4(media);
  let { result } = link4;

  m.reply(`
*Upload Tmp files*
*Link:* ${link}
*Size:* ${media.length} Byte
*Expired:* _2 hour_

*Upload Catbox*
*Link* : ${link3}
*Size* : ${media.length} Byte
*Expired* : _not expired_

*Upload Top4top*
*Link* : ${result}
*Size* : ${media.length} Byte
*Expired* : _not expired_
`);
}

handler.help = ["tourl"];
handler.tags = ["uploader"];
handler.command = /^(tourl)$/i;
handler.limit = true;
handler.register = false;

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

async function catbox(buffer) {
  try {
    const { ext } = await fileTypeFromBuffer(buffer);
    const bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, `file.${ext}`);
    bodyForm.append("reqtype", "fileupload");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: bodyForm,
    });

    const data = await res.text();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
           }

async function top4(buffer) {
    const { ext } = await fileTypeFromBuffer(buffer) || {};
    const form = new FormData();
    
    form.append('file_1_', buffer, {
        filename: `${Math.floor(Math.random() * 10000)}.${ext}`
    });
    form.append('submitr', '[ رفع الملفات ]');

    try {
        const response = await axios.post('https://top4top.io/index.php', form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0.585 Mobile Safari/534.11+'
            }
        });

        const $ = cheerio.load(response.data);
        let result = $('div.alert.alert-warning > ul > li > span').find('a').attr('href') || "gagal";

        if (!result || result === "gagal") {
            return {
                status: "error",
                msg: "Maybe file not allowed or try another file"
            };
        }

        return {
            status: "success",
            result
        };

    } catch (error) {
        console.error(error);
        return {
            status: 'error',
            msg: 'An error occurred during the upload process.'
        };
    }
      }
