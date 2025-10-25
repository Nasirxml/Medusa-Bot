import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`Contoh: .editfoto ubah jadi anime\n*Prompt wajib diisi!*`)

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime.startsWith('image/')) {
    return m.reply(`Balas gambar dengan caption *${command} <prompt>* atau kirim gambar dengan caption tersebut`)
  }

  try {
    m.reply('Sedang memproses gambar...')
    let img = await q.download()
    
    let result = await createAndGetImageResult(img, text, 1, { interval: 3000, timeout: 30000 });
    
    await conn.sendFile(m.chat, result.outputUrl, 'edit.png', 
      `✅ Berhasil diedit!\nPrompt: "${text}"`, m)
    
  } catch (err) {
    console.error('Error:', err)
    m.reply(`❌ Error: ${err.message}\n\nPastikan:\n1. API key OpenAI valid\n2. Gambar tidak corrupt\n3. Koneksi internet stabil`)
  }
}

handler.help = ['editfoto <prompt>']
handler.tags = ['ai']
handler.command = ['editfoto', 'editimage']

export default handler



async function createImageEditorFromBuffer(imageBuffer, promptText, modelId = 1) {
    const url = 'https://vdraw.ai/api/v1/r/image-editor/create';
    
    // Konversi buffer ke base64
    const imageBase64 = bufferToBase64(imageBuffer);
    
    const requestData = {
        model: modelId,
        prompt: promptText,
        image_list: [imageBase64]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Tambahkan header authorization jika diperlukan
                // 'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error creating image editor:', error);
        throw error;
    }
}

// Function untuk mendapatkan hasil image editor
async function getImageEditorResult(taskId, modelId = 1) {
    const url = 'https://vdraw.ai/api/v1/r/image-editor/result';
    
    const requestData = {
        model: modelId,
        task_id: taskId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Tambahkan header authorization jika diperlukan
                // 'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Cek jika response sukses
        if (data.code === 100000) {
            return data.data;
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
        
    } catch (error) {
        console.error('Error getting image editor result:', error);
        throw error;
    }
}

// Function untuk polling hasil sampai selesai
async function getImageEditorResultWithPolling(taskId, modelId = 1, options = {}) {
    const {
        interval = 2000, // 2 detik
        timeout = 60000, // 60 detik
        maxRetries = 30
    } = options;

    const startTime = Date.now();
    let retries = 0;

    while (retries < maxRetries && (Date.now() - startTime) < timeout) {
        try {
            const result = await getImageEditorResult(taskId, modelId);
            
            // Cek status task
            if (result.status === 'succeeded') {
                console.log('Task completed successfully!');
                return result;
            } else if (result.status === 'failed') {
                throw new Error(`Task failed: ${result.error}`);
            } else if (result.status === 'processing') {
                console.log(`Task still processing... (attempt ${retries + 1})`);
            } else {
                console.log(`Task status: ${result.status} (attempt ${retries + 1})`);
            }
            
            // Tunggu sebelum cek lagi
            await new Promise(resolve => setTimeout(resolve, interval));
            retries++;
            
        } catch (error) {
            // Jika error bukan karena task belum selesai, throw error
            if (!error.message.includes('processing')) {
                throw error;
            }
            console.log(`Waiting for task completion... (attempt ${retries + 1})`);
            await new Promise(resolve => setTimeout(resolve, interval));
            retries++;
        }
    }
    
    throw new Error(`Timeout: Task did not complete within ${timeout}ms`);
}

// Function untuk konversi buffer ke base64
function bufferToBase64(buffer) {
    // Di environment Node.js
    if (typeof Buffer !== 'undefined' && buffer instanceof Buffer) {
        return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
    
    // Di browser environment
    if (typeof btoa !== 'undefined') {
        const binary = Array.from(new Uint8Array(buffer))
            .map(byte => String.fromCharCode(byte))
            .join('');
        return `data:image/jpeg;base64,${btoa(binary)}`;
    }
    
    throw new Error('Environment tidak mendukung konversi buffer ke base64');
}


// Function utama yang menggabungkan create dan get result
async function createAndGetImageResult(imageBuffer, promptText, modelId = 1, pollingOptions = {}) {
    try {
        console.log('Creating image editor task...');
        
        // 1. Create task
        const createResult = await createImageEditorFromBuffer(imageBuffer, promptText, modelId);
        
        // Asumsikan response create mengembalikan task_id
        const taskId = createResult.data?.id || createResult.task_id;
        
        if (!taskId) {
            throw new Error('No task ID returned from create operation');
        }
        
        console.log(`Task created with ID: ${taskId}`);
        
        // 2. Poll untuk mendapatkan hasil
        console.log('Waiting for task completion...');
        const result = await getImageEditorResultWithPolling(taskId, modelId, pollingOptions);
        
        console.log('Task completed!');
        return {
            taskId: taskId,
            status: result.status,
            outputUrl: 'https://vdraw.ai' + result.output,
            error: result.error,
            createdAt: result.created_at,
            startedAt: result.started_at,
            completedAt: result.completed_at
        };
        
    } catch (error) {
        console.error('Error in createAndGetImageResult:', error);
        throw error;
    }
}