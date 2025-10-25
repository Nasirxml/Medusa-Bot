import { sizeFormatter } from "human-readable";
import { exec } from "child_process";
import os from "os";
import v8 from "v8";
import { performance } from "perf_hooks";
import axios from "axios";

let handler = async (m, { conn, setReply }) => {
    const formatSize = sizeFormatter({
        std: "JEDEC",
        decimalPlaces: 2,
        keepTrailingZeroes: false,
        render: (literal, symbol) => `${literal} ${symbol}B`,
    });

    // Menghitung runtime
    let data = global.db.data.others["runtime"];
    let time = new Date() - (data.runtime || 0);

    // Mulai hitung waktu respon
    const eold = performance.now();

    // Informasi CPU
    const cpus = os.cpus();
    const cpuInfo = cpus.map(cpu => {
        cpu.total = Object.values(cpu.times).reduce((sum, time) => sum + time, 0);
        return cpu;
    });
    const totalCPUUsage = cpuInfo.reduce((total, cpu) => {
        total.speed += cpu.speed / cpuInfo.length;
        total.totalTime += cpu.total;
        total.userTime += cpu.times.user;
        total.sysTime += cpu.times.sys;
        total.idleTime += cpu.times.idle;
        return total;
    }, {
        speed: 0,
        totalTime: 0,
        userTime: 0,
        sysTime: 0,
        idleTime: 0,
    });

    const avgCPUUsage = ((totalCPUUsage.userTime + totalCPUUsage.sysTime) / totalCPUUsage.totalTime) * 100;

    // Informasi Disk
    const diskUsage = await new Promise((resolve, reject) => {
        exec("df -h /", (error, stdout) => {
            if (error) return reject(`Error retrieving disk usage: ${error.message}`);
            const usageLine = stdout.split("\n")[1]?.split(/\s+/);
            const usagePercent = usageLine ? parseFloat(usageLine[4]?.replace("%", "")) : null;
            resolve(usagePercent);
        });
    });

    // Informasi Memori
    const memoryUsage = process.memoryUsage();
    const rssInMB = (memoryUsage.rss / 1024 / 1024).toFixed(2);
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    // Statistik Heap
    const heapStat = v8.getHeapStatistics();

    // Waktu Respon
    const neow = performance.now();

    // Informasi Lokasi
    let locationData;
    try {
        locationData = await axios.get("http://ip-api.com/json/");
    } catch (error) {
        console.error("Error fetching location data:", error);
        locationData = { data: { regionName: "Unknown", isp: "Unknown" } };
    }

    // Format Teks
    const teks = `
🖥️ *Info Server*
- *Hostname:* ${os.hostname()}
- *Platform:* ${os.platform()}
- *OS:* ${os.version()} / ${os.release()}
- *Arch:* ${os.arch()}

🌐 *Provider Info*
- *Region:* ${locationData.data.regionName}
- *ISP:* ${locationData.data.isp}

⚡ *Kecepatan Respon:* ${Number(neow - eold).toFixed(2)} ms
💻 *Runtime OS:* ${runtime(os.uptime())}
🤖 *Runtime Bot:* ${conn.clockString(time)}

🖥️ *Memori Info Server*
💾 *RAM:* ${formatSize(totalMem - freeMem)} / ${formatSize(totalMem)}
📊 *Penggunaan CPU:* ${avgCPUUsage.toFixed(2)}%
📂 *Penggunaan Disk:* ${diskUsage || "N/A"}%
🔄 *Memory Proses:* ${rssInMB} MB

💾 *NodeJS Memory Usage:*
${Object.entries(memoryUsage).map(([key, value]) => `- *${key}:* ${formatSize(value)}`).join("\n")}

🛠️ *Heap Stats:*
- *Heap Executable :* ${formatSize(heapStat.total_heap_size_executable)}
- *Physical Size :* ${formatSize(heapStat.total_physical_size)}
- *Available Size :* ${formatSize(heapStat.total_available_size)}
- *Heap Limit :* ${formatSize(heapStat.heap_size_limit)}
- *Malloced Memory :* ${formatSize(heapStat.malloced_memory)}
- *Peak Malloced Memory :* ${formatSize(heapStat.peak_malloced_memory)}
- *Does Zap Garbage :* ${formatSize(heapStat.does_zap_garbage)}
- *Native Contexts :* ${formatSize(heapStat.number_of_native_contexts)}
- *Detached Contexts :* ${formatSize(heapStat.number_of_detached_contexts)}
- *Total Global Handles :* ${formatSize(heapStat.total_global_handles_size)}
- *Used Global Handles :* ${formatSize(heapStat.used_global_handles_size)}

${cpus[0] ? `
🖥️ *Info CPU*
*_CPU Core(s) Usage (${cpus.length} Core CPU)_* 
${cpus.map((cpu, i) => `
${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)
 - *User Time:* ${(100 * cpu.times.user / cpu.total).toFixed(2)}%
 - *System Time:* ${(100 * cpu.times.sys / cpu.total).toFixed(2)}%
 - *Idle Time:* ${(100 * cpu.times.idle / cpu.total).toFixed(2)}%
`).join('\n')}
`.trim() : ''}
`;

    setReply(teks);
};

handler.tags = ["info"];
handler.command = ["os"];
export default handler;

function runtime(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
  }
