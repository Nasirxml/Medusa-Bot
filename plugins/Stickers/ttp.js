import fetch from "node-fetch";
import cheerio from "cheerio";

let handler = async (m, { q, conn, args, usedPrefix, setReply, command }) => {
    if (!q) return setReply(mess.query);
    if (q.length > 25) return m.reply('Maximal teks hanya 25 karakter');
    let aan = await ttp(q);
    let media = aan[0].url;
    await conn.toSticker(m.chat, media, m);
  };
  handler.help = ["sticker"];
  handler.tags = ["tools"];
  handler.command = ["ttp"];
  
  export default handler;
  
  async function ttp(text) {
    try {
        const response = await fetch("https://www.picturetopeople.org/p2p/text_effects_generator.p2p/transparent_text_effect", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                Cookie: "_ga=GA1.2.1667267761.1655982457; _gid=GA1.2.77586860.1655982457; __gads=ID=c5a896288a559a38-224105aab0d30085:T=1655982456:RT=1655982456:S=ALNI_MbtHcmgQmVUZI-a2agP40JXqeRnyQ; __gpi=UID=000006149da5cba6:T=1655982456:RT=1655982456:S=ALNI_MY1RmQtva14GH-aAPr7-7vWpxWtmg; _gat_gtag_UA_6584688_1=1",
            },
            body: new URLSearchParams({
                TextToRender: text,
                FontSize: "100",
                Margin: "30",
                LayoutStyle: "0",
                TextRotation: "0",
                TextColor: "000000",
                TextTransparency: "0",
                OutlineThickness: "3",
                OutlineColor: "000000",
                FontName: "Lekton",
                ResultType: "view",
            }).toString(),
        });

        const bodyText = await response.text();
        const $ = cheerio.load(bodyText);
        const results = [];
        $('form[name="MyForm"]').each((index, formElement) => {
            const resultFile = $(formElement).find('#idResultFile').attr('value');
            const refTS = $(formElement).find('#idRefTS').attr('value');
            results.push({
                url: 'https://www.picturetopeople.org' + resultFile,
                title: refTS
            });
        });

        return results;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
            }
