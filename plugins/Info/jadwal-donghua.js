//import { proto, generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys';
let {
  generateWAMessageFromContent,
  proto,
  prepareWAMessageMedia,
} = require("@whiskeysockets/baileys");

let handler = async (m, { conn }) => {
  conn.sendMessage(m.chat, { text: 'Menyiapkan Request Mu, Sabar :v' }, { quoted: m });

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '-',
              newsletterName: 'CLICK BUTTON HERE✅',
              serverMessageId: -1
            },
            forwardingScore: 256,
            externalAdReply: {
              title: 'NTHNG',
              thumbnailUrl: 'https://telegra.ph/file/a6f3ef42e42efcf542950.jpg',
              sourceUrl: 'h',
              mediaType: 2,
              renderLargerThumbnail: false
            }
          },
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: `*Halo Kak @${m.sender.replace(/@.+/g, '')}!*\nIni Jadwal Donghua Untuk Hari Senin - Minggu`
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: 'Powered By _*Nasirxml*_'
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: [
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> *1. Against the Sky Supreme*\n> *2. A Record of A Mortals Jourey to Immortality*\n> *3. Wonderland*\n> *4. Supreme God Emperor*\n> *5. Renegade Immortal*\n> *6. Dubu Xiaoyao*\n> *7. The Legend of Sword Domain*\n> *8. Ancient Myth*\n> *9. Purgatory Walkers*\n\n`📝 *Catatan :*`\n\n>*Sewaktu-waktu Jadwal Donghua Bisa Berubah*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '*Jadwal Donghua Senin*\n',
                  hasMediaAttachment: true, ...(await prepareWAMessageMedia({ image: { url: 'https://telegra.ph/file/65fe2551040bc21701344.jpg' } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Website","url":"https://anichin.site","merchant_url":"https://anichin.site"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> *1. Swallowed Star*\n> *2. Martial Master*\n> *3. Lord of the Ancient God Grave*\n> *4. Spirit Sword Sovereign*\n> *5. Sage Ancestor*\n> *6. 100.000 Years of Refining Qi*\n> *7. Supreme Alchemy*\n> *8. Glorious Revenge of Ye Feng*\n> *9. Tales of Demons and Gods*\n> *10. King of Loose Cultivators*\n> *11. Peerless Battle Spirit*\n\n📝 *Catatan :*\n\n> *Sewaktu-waktu Jadwal Donghua Bisa Berubah*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '*Jadwal Donghua Selasa*\n',
                  hasMediaAttachment: true, ...(await prepareWAMessageMedia({ image: { url: 'https://telegra.ph/file/65fe2551040bc21701344.jpg' } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Website","url":"https://anichin.site","merchant_url":"https://anichin.site"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> *1. Shrouding the Heavens*\n> *2. Xi Xing Ji*\n> *3. Peerless Martial Spirit*\n> *4. Peak of True Martial Arts*\n> *5. Tales of Dark River*\n> *6. Hidden Sect Leader*\n> *7. Tje Island of Silling 2*\n> *8. Heavenly Brick Knight*\n\n📝 *Catatan :*\n\n> *Sewaktu-waktu Jadwal Donghua Bisa Berubah*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '*Jadwal Donghua Rabu*\n',
                  hasMediaAttachment: true, ...(await prepareWAMessageMedia({ image: { url: 'https://telegra.ph/file/65fe2551040bc21701344.jpg' } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Website","url":"https://anichin.site","merchant_url":"https://anichin.site"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> *1. Throne of Seal*\n> *2. Dragon Prince Yuan*\n> *3. The Legend of Sword Domain*\n> *4. Wonderland*\n> *5. My Senior Brother Is Too Stedy*\n> *6. Ancient Myth*\n> *7. Dubu Xiaoyao*\n> *8. The Emperor of Myriad Realms*\n> *9. Villain Intialization*\n> *10. Charm of Soul Pets*\n\n📝 *Catatan :*\n\n> *Sewaktu-waktu Jadwal Donghua Bisa Berubah*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '*Jadwal Donghua Kamis*\n',
                  hasMediaAttachment: true, ...(await prepareWAMessageMedia({ image: { url: 'https://telegra.ph/file/65fe2551040bc21701344.jpg' } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Website","url":"https://anichin.site","merchant_url":"https://anichin.site"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> *1. Perfect World*\n> *2. Against the Sky Supreme*\n> *3. Spirit Sword Sovereign*\n> *4. Supreme God Emperor*\n> *5. Supreme Alchemy*\n> *6. Apotheosis*\n> *7. Nirvana of Storm Rider*\n> *8. Glorious Revenge of Ye Feng*\n\n📝 *Catatan :*\n\n> *Sewaktu-waktu Jadwal Donghua Bisa Berubah*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '*Jadwal Donghua Jum`at*\n',
                  hasMediaAttachment: true, ...(await prepareWAMessageMedia({ image: { url: 'https://telegra.ph/file/65fe2551040bc21701344.jpg' } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Website","url":"https://anichin.site","merchant_url":"https://anichin.site"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> *1. Jade Dynasty*\n> *2. Soul Land 2*\n> *3. Tales of Demon and Gods*\n> *4. Lord of the Ancient God Grave*\n> *5. 100.000 Uears of Refining Qi*\n> *6. Magic Chef of Fire and Ice*\n> *7. Hidden Sect Leader*\n> *8. Peak of True Martial Arts*\n> *9. Peerless Battle Spirit*\n> *10. Golden Guards: The Wind Rises From Jinling*\n> *11. Mom, I`m Sorry*\n\n📝 *Catatan :*\n\n> *Sewaktu-waktu Jadwal Donghua Bisa Berubah*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '*Jadwal Donghua Sabtu*\n',
                  hasMediaAttachment: true, ...(await prepareWAMessageMedia({ image: { url: 'https://telegra.ph/file/65fe2551040bc21701344.jpg' } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Website","url":"https://anichin.site","merchant_url":"https://anichin.site"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> *1. Oyen `Battle Through the Heavens` *\n> *2. Martial Master*\n> *3. Peerless Martial Spirit*\n> *4. Legend of Martial Immortal*\n> *5. Legend of Soldier*\n> *6. Immortality*\n> *7. The Emperor of Myriad Realms*\n\n📝 *Catatan :*\n\n> *Sewaktu-waktu Jadwal Donghua Bisa Berubah*'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '*Jadwal Donghua Minggu*\n',
                  hasMediaAttachment: true, ...(await prepareWAMessageMedia({ image: { url: 'https://telegra.ph/file/65fe2551040bc21701344.jpg' } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Website","url":"https://anichin.site","merchant_url":"https://anichin.site"}`
                    }
                  ]
                })
              }
            ]
          })
        })
      }
    }
  }, { userJid: m.chat, quoted: m });

  conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
};

handler.help = ['jadwaldonghua'];
handler.tags = ['info'];
handler.command = /^(jadwaldonghua)$/i;
handler.private = false;

export default handler;
