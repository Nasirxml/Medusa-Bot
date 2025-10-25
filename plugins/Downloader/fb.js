import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Example*: /${command} https://www.facebook.com/100063980835309/videos/395936539473273/?app=fbl`;
    
    m.reply(wait);
    try {
        let { links } = await fb(text);
        
        if (links && links['Download High Quality']) {
            conn.sendMessage(m.chat, { video: { url: links['Download High Quality'] }}, { quoted: m });
        } else {
            m.reply('Video not found or could not be downloaded.');
        }
    } catch (e) {
        console.error(e);
        m.reply('An error occurred while trying to download the video.');
    }
};

handler.help = ["facebook"];
handler.tags = ["downloader"];
handler.command = /^(fb(dl)?|facebook(dl)?)$/i;
handler.register = true;

export default handler;

async function fb(vid_url) {
    try {
        const searchParams = new URLSearchParams();
        searchParams.append('url', vid_url);
        
        const response = await fetch('https://facebook-video-downloader.fly.dev/app/main.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: searchParams.toString(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (e) {
        console.error(e);
        return null;
    }
		}

	      
