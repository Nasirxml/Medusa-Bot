import yts from 'yt-search';
import axios from "axios";
import cheerio from "cheerio";

let handler = async (m, { conn, text, setReply, usedPrefix, command }) => {
    if (!text) throw (`Contoh : ${usedPrefix + command} dj aku meriang`);
    setReply("_Tunggu sebentar kak..._");
    try {
        let look = await yts(text);
        
        if (!look.all || look.all.length === 0) {
            throw new Error("Video tidak ditemukan.");
        }

        let convert = look.all[0];
        let res = await download(convert.url)    

        let audioUrl = res.download_url       

        let caption = '';
        caption += `*∘ Title :* ${convert.title}\n`;
        caption += `*∘ Duration :* ${convert.timestamp}\n`;
        caption += `*∘ Viewers :* ${convert.views}\n`;
        caption += `*∘ Upload At :* ${convert.ago}\n`;
        caption += `*∘ Author :* ${convert.author.name}\n`;
        caption += `*∘ Description :* ${convert.description}\n`;
        caption += `*∘ Url :* ${convert.url}\n`;

        conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: convert.title,
                        body: convert.author.name,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: convert.image,
                        sourceUrl: null
                    }
                },
                mentions: [m.sender]
            }
        }, {});

        conn.sendMessage(m.chat, {
            audio: {
                url: audioUrl
            },
            mimetype: 'audio/mpeg' }, {
            quoted: m
        });
    } catch (e) {
        console.error(e);  
        m.reply('lagi error kak');
    }
};

handler.command = handler.help = ['play'];
handler.tags = ['downloader'];
handler.limit = true;

export default handler;

async function search(query) {
  const searchUrl = 'https://s60.notube.net/suggestion.php?lang=id';
  const payload = new URLSearchParams({
    keyword: query,
    format: 'mp3',
    subscribed: 'false'
  });

  try {
    const { data } = await axios.post(searchUrl, payload.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://notube.net',
        'Referer': 'https://notube.net/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const results = [];
    $('.row > a').each((i, element) => {
      const onclickAttr = $(element).attr('onclick');
      const urlMatch = onclickAttr.match(/DOWNL\('([^']+)'/);
      const videoUrl = urlMatch ? urlMatch[1] : null;

      if (videoUrl) {
        const title = $(element).find('p').text().trim();
        const thumbnail = $(element).find('img').attr('src');
        const duration = $(element).find('div[style*="background-color"]').text().trim();
        const author = $(element).find('small font').first().text().trim();
        const description = $(element).find('small font').last().text().trim();

        results.push({
          title,
          author,
          duration,
          description,
          thumbnail,
          url: videoUrl,
        });
      }
    });
    return results;
  } catch (error) {
    throw new Error('Gagal nggolek video. Ono sing salah iki.');
  }
}

async function pollForDownloadLink(token, retries = 15, delay = 2000) {
  const downloadPageUrl = `https://notube.net/id/download?token=${token}`;
  for (let i = 0; i < retries; i++) {
    const { data: pageData } = await axios.get(downloadPageUrl);
    const $ = cheerio.load(pageData);
    const finalDownloadUrl = $('#downloadButton').attr('href');

    if (finalDownloadUrl && finalDownloadUrl.includes('key=') && !finalDownloadUrl.endsWith('key=')) {
      const title = $('#blocLinkDownload h2').text().trim();
      return { title, download_url: finalDownloadUrl };
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error('Suwi banget, link download-e ora ketemu. Sabar to!');
}

async function download(url, format = 'mp3') {
  const serverUrl = 'https://s60.notube.net';

  try {
    const weightPayload = new URLSearchParams({ url, format, lang: 'id', subscribed: 'false' });
    const { data: weightData } = await axios.post(`${serverUrl}/recover_weight.php`, weightPayload.toString());

    const { token, name_mp4 } = weightData;
    if (!token) throw new Error('Ora iso nemokke token, Rek!');

    const filePayload = new URLSearchParams({ url, format, name_mp4, lang: 'id', token, subscribed: 'false', playlist: 'false', adblock: 'false' });
    await axios.post(`${serverUrl}/recover_file.php?lang=id`, filePayload.toString());

    const conversionPayload = new URLSearchParams({ token });
    await axios.post(`${serverUrl}/conversion.php`, conversionPayload.toString());

    return await pollForDownloadLink(token);
  } catch (error) {
    throw new Error('Gagal ngunduh video. Coba maneh, Rek.');
  }
}


async function testSearch() {
  try {
    const results = await search('Dj Ya Odna');
    console.log('BERHASIL', results);
  } catch (error) {
    console.error('GAGAL', error.message);
  }
}