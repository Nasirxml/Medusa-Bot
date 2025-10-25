import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
    let input = `[!] *wrong input*

    Contoh : ${usedPrefix + command} https://vt.tiktok.com/ZSYgBPSLD/`;

    if (!text) return m.reply(input);
    if (!(text.includes('http://') || text.includes('https://')))
        return m.reply(`URL invalid, please input a valid URL. Try with adding http:// or https://`);
    if (!text.includes('tiktok.com'))
        return m.reply(`Invalid TikTok URL.`);

    try {
        let { dlink } = await ttsave.video(text);
        await conn.sendMessage(m.chat, { audio: { url: dlink.audio }, mimetype: 'audio/mpeg' }, { quoted: m });
    } catch (e) {
        console.error(e);
        m.reply(`Error: ${e.message}`);
    }
};

handler.help = ["downloader"];
handler.tags = ["internet"];
handler.command = ["ttaudio", "ttmp3", "tiktokaudio", "tiktokmusik"];
handler.limit = true;

export default handler;

const headers = {
    authority: 'ttsave.app',
    accept: 'application/json, text/plain, */*',
    origin: 'https://ttsave.app',
    referer: 'https://ttsave.app/en',
    'user-agent': 'Postify/1.0.0',
};

const ttsave = {
    submit: async function (url, referer) {
        const headerx = { ...headers, referer };
        const data = { query: url, language_id: '1' };
        return axios.post('https://ttsave.app/download', data, { headers: headerx });
    },

    parse: function ($) {
        const uniqueId = $('#unique-id').val();
        const nickname = $('h2.font-extrabold').text();
        const profilePic = $('img.rounded-full').attr('src');
        const username = $('a.font-extrabold.text-blue-400').text();
        const description = $('p.text-gray-600').text();

        const dlink = {
            nowm: $('a.w-full.text-white.font-bold').first().attr('href'),
            wm: $('a.w-full.text-white.font-bold').eq(1).attr('href'),
            audio: $("a[type='audio']").attr("href"),
            profilePic: $("a[type='profile']").attr("href"),
            cover: $("a[type='cover']").attr("href"),
        };

        const stats = {
            plays: "",
            likes: "",
            comments: "",
            shares: "",
        };

        $(".flex.flex-row.items-center.justify-center").each((index, element) => {
            const $element = $(element);
            const svgPath = $element.find("svg path").attr("d");
            const value = $element.find("span.text-gray-500").text().trim();

            if (svgPath && svgPath.includes("10 18a8 8 0 100-16")) {
                stats.plays = value;
            } else if (svgPath && svgPath.includes("3.172 5.172a4 4 0 015.656")) {
                stats.likes = value || "0";
            } else if (svgPath && svgPath.includes("18 10c0 3.866-3.582")) {
                stats.comments = value;
            } else if (svgPath && svgPath.includes("17.593 3.322c1.1.128")) {
                stats.shares = value;
            }
        });

        const songTitle = $(".flex.flex-row.items-center.justify-center.gap-1.mt-5")
            .find("span.text-gray-500")
            .text()
            .trim();

        const slides = $("a[type='slide']")
            .map((i, el) => ({
                number: i + 1,
                url: $(el).attr("href"),
            }))
            .get();

        return {
            uniqueId,
            nickname,
            profilePic,
            username,
            description,
            dlink,
            stats,
            songTitle,
            slides,
        };
    },

    video: async function (link) {
        try {
            const response = await this.submit(link, 'https://ttsave.app/en');
            const $ = cheerio.load(response.data);
            const result = this.parse($);

            if (result.slides && result.slides.length > 0) {
                return { type: 'slide', ...result };
            }

            return {
                type: 'video',
                ...result,
                videoInfo: {
                    nowm: result.dlink.nowm,
                    wm: result.dlink.wm,
                },
            };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to retrieve TikTok video information.');
        }
    },
};
