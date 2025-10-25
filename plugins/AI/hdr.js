import axios from "axios";
import FormData from "form-data";

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    args
}) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    if (!/image\/(jpe?g|png)/.test(mime)) {
        return m.reply(`Tipe ${mime} tidak didukung!`);
}
    let img = await q.download();
await m.reply(wait);
    const response = await imgupscale.upscale(img, 4);

   await conn.sendFile(m.sender, response.downloadUrls[0], "upscaled.jpg", 'Ini dia, Kak!', m);
};

handler.help = ["hdr"];
handler.tags = ["ai"];
handler.command = /^(hdr)$/i;

export default handler;

const imgupscale = {
  req: async (imageBuffer, scaleRatio) => {
    try {
      const data = new FormData();
      data.append('myfile', imageBuffer, {
        filename: 'nasirxml.jpg', // Nama file wajib ada walau dummy
        contentType: 'image/jpeg' // Bisa diganti image/png jika perlu
      });
      data.append('scaleRadio', scaleRatio.toString());

      const config = {
        method: 'POST',
        url: 'https://get1.imglarger.com/api/UpscalerNew/UploadNew',
        headers: {
          ...data.getHeaders(),
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'sec-ch-ua-platform': '"Android"',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'dnt': '1',
          'sec-ch-ua-mobile': '?1',
          'origin': 'https://imgupscaler.com',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'referer': 'https://imgupscaler.com/',
          'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'priority': 'u=1, i'
        },
        data
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  },

  cek: async (code, scaleRatio) => {
    try {
      const data = JSON.stringify({ code, scaleRadio: scaleRatio });

      const config = {
        method: 'POST',
        url: 'https://get1.imglarger.com/api/UpscalerNew/CheckStatusNew',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'sec-ch-ua-platform': '"Android"',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'dnt': '1',
          'sec-ch-ua-mobile': '?1',
          'origin': 'https://imgupscaler.com',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'referer': 'https://imgupscaler.com/',
          'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'priority': 'u=1, i'
        },
        data
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw new Error(`Status check failed: ${error.message}`);
    }
  },

  upscale: async (imageBuffer, scaleRatio, maxRetries = 30, retryDelay = 2000) => {
    try {
      console.log('Uploading image from buffer...');
      const uploadResult = await imgupscale.req(imageBuffer, scaleRatio);

      if (uploadResult.code !== 200) {
        throw new Error(`Upload failed: ${uploadResult.msg}`);
      }

      const code = uploadResult.data.code;
      for (let i = 0; i < maxRetries; i++) {
        const statusResult = await imgupscale.cek(code, scaleRatio);

        if (statusResult.code === 200 && statusResult.data.status === 'success') {
          console.log('Processing completed!');
          return {
            success: true,
            downloadUrls: statusResult.data.downloadUrls,
            filesize: statusResult.data.filesize,
            originalFilename: statusResult.data.originalfilename,
            code
          };
        }

        if (statusResult.data.status === 'error') {
          throw new Error('Processing failed on server');
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }

      throw new Error('Processing timeout - maximum retries exceeded');
    } catch (error) {
      throw new Error(`Upscale failed: ${error.message}`);
    }
  }
};