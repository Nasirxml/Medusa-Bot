import fetch from "node-fetch";
import fs from "fs";

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    let nomorown = '6282353035070'; 
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let ephemeral = 3600000;
    let wm = 'Medusa';
    let sourceUrl = 'https://medusa.com';

    let vcard = `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:Nasirxml
item.ORG: Creator Bot
item1.TEL;waid=${nomorown}:${nomorown}@s.whatsapp.net
item1.X-ABLabel:Creator Bot 
item2.EMAIL;type=INTERNET:medusa@gmaio.com
item2.X-ABLabel:Email Owner
item3.ADR:;;🇮🇩 Indonesia;;;;
item3.X-ABADR:ac
item4.EMAIL;type=INTERNET:medusa@gmail.com
item4.X-ABLabel:Email Developer 
item3.ADR:;;🇮🇩 Indonesia;;;;
item3.X-ABADR:ac 
item5.URL:https://instagram.com/_sirrrr
item5.X-ABLabel:Website
END:VCARD`;

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: 'Nasirxml',
            contacts: [{ vcard }]
        }
    }, {
        quoted: m,
        ephemeralExpiration: ephemeral,
        contextInfo: { 
            externalAdReply: { 
                title: 'Contact Owner', 
                body: wm, 
                sourceUrl: sourceUrl,
                thumbnail: null,
                mediaType: 1,
                showAdAttribution: false, 
                renderLargerThumbnail: false 
            },
            mentionedJid: [nomorown]
        }
    });
};

handler.help = ['owner'];
handler.tags = ['info'];
handler.command = /^(dev|owner|creator)$/i;

export default handler;
