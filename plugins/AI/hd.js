const axios = require('axios');
const FormData = require('form-data');
async function ihancer(buffer, { method = 1, size = 'low' } = {}) {
    try {
        const _size = ['low', 'medium', 'high'];
        
        if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Image buffer is required');
        if (method < 1 || method > 4) throw new Error('Available methods: 1, 2, 3, 4');
        if (!_size.includes(size)) throw new Error(`Available sizes: ${_size.join(', ')}`);
        
        const form = new FormData();
        form.append('method', method.toString());
        form.append('is_pro_version', 'false');
        form.append('is_enhancing_more', 'false');
        form.append('max_image_size', size);
        form.append('file', buffer, `rynn_${Date.now()}.jpg`);
        
        const { data } = await axios.post('https://ihancer.com/api/enhance', form, {
            headers: {
                ...form.getHeaders(),
                'accept-encoding': 'gzip',
                host: 'ihancer.com',
                'user-agent': 'Dart/3.5 (dart:io)'
            },
            responseType: 'arraybuffer'
        });
        
        return Buffer.from(data);
    } catch (error) {
        throw new Error(error.message);
    }
}
let handler = async (m, { conn, usedPrefix, command, text }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) return conn.reply(m.chat, `Send/Reply an image with the caption *.${command}*\n\nUsage: *.${command} <method> <size>*\n\nMethod: 1-4 (default: 1)\nSize: low, medium, high (default: medium)\n\nExample: *.${command} 2 high*`, m);
    
    let args = text ? text.split(' ') : [];
    let method = args[0] ? parseInt(args[0]) : 1;
    let size = args[1] ? args[1].toLowerCase() : 'medium';
    
    if (method < 1 || method > 4) {
        return conn.reply(m.chat, `❌ Method harus antara 1-4\nContoh: *.${command} 2 high*`, m);
    }
    
    if (!['low', 'medium', 'high'].includes(size)) {
        return conn.reply(m.chat, `❌ Size harus: low, medium, atau high\nContoh: *.${command} 2 high*`, m);
    }
    
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    try {
        let media = await q.download();
        
        const enhancedBuffer = await ihancer(media, { 
            method: method, 
            size: size 
        });
        
        await conn.sendFile(m.chat, enhancedBuffer, 'enhanced.jpg', `✅ Gambar berhasil di-enhance!\n📊 Method: ${method}\n📏 Size: ${size}`, m);
        
    } catch (error) {
        console.error('Error in Image Enhancement:', error.message);
        conn.reply(m.chat, `❌ Terjadi kesalahan saat memproses gambar: ${error.message}`, m);
    }
};
handler.help = ["hd <method> <size>"];
handler.tags = ["ai"];
handler.command = ["hd"];
export default handler;