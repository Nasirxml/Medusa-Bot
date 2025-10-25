import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`• Contoh: ${usedPrefix + command} https://videy.co/v?id=K7wdQnbm`);
  if (!/^http(s)?:\/\/videy\.co/i.test(args[0])) {
    return m.reply('Link Invalid');
  }

  try {
    m.reply(mess.wait);
    const url = args[0];
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const video = $('source[type="video/mp4"]').attr('src');
    if (video) {
      await conn.sendFile(m.chat, video, null, '', m);
    } else {
      throw new Error('Video source not found');
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

handler.help = ['videy'];
handler.tags = ['downloader'];
handler.command = /^(videy(dl)?)$/i;

export default handler;
