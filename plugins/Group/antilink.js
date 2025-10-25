let handler = async (
  m,
  { conn,q, args, isOwner, setReply, text, command, usedPrefix }
) => {
  const isAntilink = m.isGroup ? db.data.chats[m.chat].antilink : false;
  if (!m.isAdmin) return setReply(mess.only.admin);
  if (!m.isGroup) return setReply("hanya bisa di group");
  if (args[0] === "on" || args[0] === "enable" || args[0] === "1") {
    if (isAntilink) return setReply("Fitur sudah aktif kak");
    db.data.chats[m.chat].antilink = true;
    let ih = `Fitur antilink group telah di aktifkan`;
    setReply(ih);
  } else if (args[0] === "off" || args[0] === "disable" || args[0] === "0") {
    if (!isAntilink) return setReply("Udah mati");
    db.data.chats[m.chat].antilink = false;
    let ih = `Fitur antilink group telah di matikan`;
    setReply(ih);
  } else if (!q) {
    setReply("Pilih on atau off");
  }
};
handler.help = ["antilink"];
handler.tags = ["group"];
handler.command = ["antilink"];
handler.group = true;
handler.admin = true;
export default handler;
      
