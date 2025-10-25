import axios from "axios";
import qs from "qs";
import uploadImage from '../../lib/uploadImage.js';

let handler = async (m, { text, usedPrefix, command, conn }) => {
   let q = m.quoted ? m.quoted : m;
   let mime = (q.msg || q).mimetype || '';
   
   if(!mime) throw `reply foto nya dengan caption ${usedPrefix + command}`;
   let media = await q.download();
   let img = await uploadImage(media);

   let res = await pxpic.create(img, `${command}`);
   
   await conn.sendMessage(m.chat, { image: { url: res.resultImageUrl }, caption: "Done Abangkuhh" },{ quoted : m });
};

handler.help = handler.command = ["removebg"];
handler.tags = ["tools"];

export default handler;

const tool = ['removebg', 'enhance', 'upscale', 'restore', 'colorize'];

const pxpic = {
    upload: async (imageUrl) => {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const ext = imageUrl.split('.').pop();
        const mime = response.headers['content-type'];
        const fileName = Date.now() + "." + ext;

        const folder = "uploads";
        const responsej = await axios.post("https://pxpic.com/getSignedUrl", { folder, fileName }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { presignedUrl } = responsej.data;

        await axios.put(presignedUrl, buffer, {
            headers: {
                "Content-Type": mime,
            },
        });

        const cdnDomain = "https://files.fotoenhancer.com/uploads/";
        const sourceFileUrl = cdnDomain + fileName;

        return sourceFileUrl;
    },
    create: async (imageUrl, tools) => {
        if (!tool.includes(tools)) {
            return `Pilih salah satu dari tools ini: ${tool.join(', ')}`;
        }
        const url = await pxpic.upload(imageUrl);
        let data = qs.stringify({
            'imageUrl': url,
            'targetFormat': 'png',
            'needCompress': 'no',
            'imageQuality': '100',
            'compressLevel': '6',
            'fileOriginalExtension': 'png',
            'aiFunction': tools,
            'upscalingLevel': ''
        });

        let config = {
            method: 'POST',
            url: 'https://pxpic.com/callAiFunction',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept-language': 'id-ID'
            },
            data: data
        };

        const api = await axios.request(config);
        return api.data;
    }
            }
