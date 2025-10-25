let handler = async (m, { conn, usedPrefix, text }) => {
 
m.reply(`_Tunggu, Dukun sedang cek khodam kamu_`)
await sleep(1500) 
m.reply("_mendapatkan informasi khodam.._") 
await sleep(1500) 
m.reply(`khodam kamu adalah : ${await pickRandom(khodam)}`) 
  
};
handler.help = ["cekkhodam"];
handler.tags = ["rpg"];
handler.command = /^(cekkhodam)/i;
handler.register = true;
handler.group = true;
export default handler;

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

const khodam = [
 "*Harimau Putih*\n\n*Penjelasan :* Kamu kuat dan berani seperti harimau, karena pendahulumu mewariskan kekuatan besar padamu.",
 "*Monyet Kekar*\n\n*Penjelasan :* Kamu lincah dan cerdas, mampu menghadapi berbagai tantangan dengan ketangkasan.",
 "*Naga Merah*\n\n*Penjelasan :* Kamu memiliki kekuatan luar biasa dan kebijaksanaan, seperti naga yang legendaris.",
 "*Burung Garuda*\n\n*Penjelasan :* Kamu bebas dan perkasa, melambangkan kebebasan dan kemuliaan.",
 "*Serigala Hitam*\n\n*Penjelasan :* Kamu setia dan memiliki insting tajam, mampu melindungi diri dan orang lain.",
 "*Macan Kumbang*\n\n*Penjelasan :* Kamu misterius dan kuat, seperti macan yang jarang terlihat tapi selalu waspada.",
 "*Kuda Emas*\n\n*Penjelasan :* Kamu berharga dan kuat, siap untuk berlari menuju kesuksesan.",
 "*Elang Biru*\n\n*Penjelasan :* Kamu memiliki visi yang tajam dan dapat melihat peluang dari jauh.",
 "*Harimau Loreng*\n\n*Penjelasan :* Kamu tangguh dan memiliki kekuatan untuk melindungi dan menyerang.",
 "*Gajah Putih*\n\n*Penjelasan :* Kamu bijaksana dan memiliki kekuatan besar, lambang dari keberanian dan keteguhan hati.",
 "*Banteng Sakti*\n\n*Penjelasan :* Kamu kuat dan penuh semangat, tidak takut menghadapi rintangan.",
 "*Ular Raksasa*\n\n*Penjelasan :* Kamu memiliki kebijaksanaan dan kekuatan tersembunyi, siap menyerang jika diperlukan.",
 "*Ikan Dewa*\n\n*Penjelasan :* Kamu tenang dan penuh kedamaian, membawa rezeki dan keberuntungan.",
 "*Kucing Hitam*\n\n*Penjelasan :* Kamu misterius dan penuh dengan rahasia, membawa keberuntungan bagi yang memahami.",
 "*Rusa Emas*\n\n*Penjelasan :* Kamu anggun dan berharga, selalu dihargai oleh orang-orang di sekitarmu.",
 "*Singa Bermahkota*\n\n*Penjelasan :* Kamu lahir sebagai pemimpin, memiliki kekuatan dan kebijaksanaan seorang raja.",
 "*Kijang Perak*\n\n*Penjelasan :* Kamu cepat dan cekatan, selalu waspada dan siap untuk melompat lebih jauh.",
 "*Anjing Pelacak*\n\n*Penjelasan :* Kamu setia dan penuh dedikasi, selalu menemukan jalan menuju tujuanmu.",
]
