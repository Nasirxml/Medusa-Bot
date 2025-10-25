import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { text, conn, usedPrefix, command }) => {
    try {
        if (command === 'anichin') {
            let res = await ambilRilisanEpisodeTerbaru();
            if (!res.length) throw new Error('Data kosong.');

            let teks = '*📢 Rilisan Terbaru Dari Anichin:*\n';
            for (let i in res) {
                teks += `\n\n${parseInt(i) + 1}. *${res[i].title}*`;
                teks += `\n◦ Episode: ${res[i].eps}`;
                teks += `\n◦ Link: ${res[i].link}`;
            }

            await conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: teks,
                    contextInfo: {
                        externalAdReply: {
                            title: 'A N I C H I N  U P D A T E',
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: 'https://files.catbox.moe/bm5dac.jpg',
                            sourceUrl: 'https://anichin.moe/'
                        }
                    },
                    mentions: [m.sender]
                }
            }, { quoted: m });

        } else if (command === 'anichindetail') {
            if (!text || !text.startsWith('http')) {
                return m.reply(`❌ Gunakan format: ${usedPrefix}${command} <link_rilisan_dari_anichin>`);
            }

            let detail = await getEpisodeInfo(text.trim());
            if (!detail) throw new Error('Gagal mengambil detail.');

            let info = `*📺 Detail Episode:*\n\n`;
            info += `◦ *Judul:* ${detail.title}\n`;
            info += `◦ *Tipe:* ${detail.type}\n`;
            info += `◦ *Rilis:* ${detail.released}\n`;
            info += `◦ *Author:* ${detail.author}\n`;
            info += `◦ *Series:* ${detail.series}\n`;
            info += `◦ *Link Download:*\n`;

            for (let link of detail.links) {
                info += `\n- ${link.quality} - ${link.name}: ${link.href}`;
            }

            await m.reply(info);
        }
    } catch (e) {
        console.error('Terjadi kesalahan:', e.message);
        await m.reply(`❌ ${e.message}`);
    }
};

handler.help = ['anichin', 'anichindetail'];
handler.tags = ['search'];
handler.command = /^anichin(detail)?$/i;

export default handler;

// Ambil rilisan terbaru dari homepage Anichin
async function ambilRilisanEpisodeTerbaru() {
    try {
        const { data } = await axios.get('https://anichin.moe/');
        const $ = cheerio.load(data);

        const rilisan = [];

        $('li:has(i)').each((i, el) => {
            const $el = $(el);
            const fullText = $el.clone().children('i').remove().end().text().trim();
            const epsText = $el.find('span.r').text().trim();
            const link = $el.find('a').attr('href');
            const title = fullText.replace(epsText, '').trim();

            if (title && link && epsText) {
                rilisan.push({ title, eps: epsText, link });
            }
        });

        return rilisan.slice(0, 10); // Hanya ambil 10 data
    } catch (error) {
        console.error('Gagal mengambil data:', error.message);
        return [];
    }
}

// Ambil detail rilisan dari halaman episode
async function getEpisodeInfo(url) {
    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            }
        });

        const $ = cheerio.load(html);

        const canonicalUrl = $('link[rel="canonical"]').attr('href') || '';
        const titleSlug = canonicalUrl.split('/').filter(Boolean).pop().replace(/-/g, ' ');
        const title = titleSlug.replace(/\b\w/g, c => c.toUpperCase());
        const type = $('i.status').text().trim();
        const released = $('span.updated').text().trim();
        const author = $('a[href*="/author/"]').text().trim();
        const series = $('meta[property="article:section"]').attr('content') || '';
        const links = [];

        $('.soraurlx').each((i, el) => {
            const quality = $(el).find('strong').first().text().trim();
            $(el).find('a').each((j, a) => {
                const href = $(a).attr('href');
                const name = $(a).text().trim();
                if (href) links.push({ quality, name, href });
            });
        });

        return { title, type, released, author, series, links };
    } catch (error) {
        console.error('Gagal mengambil detail:', error.message);
        return null;
    }
}