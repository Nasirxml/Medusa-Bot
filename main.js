//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import "./settings.js";
import baileys, { useMultiFileAuthState, Browsers } from "@whiskeysockets/baileys";

import fs, { readdirSync, existsSync, readFileSync, writeFileSync, statSync } from "fs";
import logg from "pino";
import { Socket, smsg, protoType } from "./lib/simple.js";
import CFonts from "cfonts";
import path, { join, dirname } from "path";
import { memberUpdate } from "./message/group.js";
import { antiCall } from "./message/anticall.js";
import { Function } from "./message/function.js";
import NodeCache from "node-cache";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { platform } from "process";
import syntaxerror from "syntax-error";
import { format } from "util";
import chokidar from "chokidar";
import chalk from "chalk";
import util from "util";

const __dirname = dirname(fileURLToPath(import.meta.url));
global.__filename = function filename(
  pathURL = import.meta.url,
  rmPrefix = platform !== "win32"
) {
  return rmPrefix
    ? /file:\/\/\//.test(pathURL)
      ? fileURLToPath(pathURL)
      : pathURL
    : pathURL;
};

global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

protoType();

const readline = await import("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const pairingCode = true; // ubah true jika mau pairing
const msgRetryCounterCache = new NodeCache();

CFonts.say("Nasirxml", {
  font: "chrome",
  align: "left",
  gradient: ["red", "magenta"],
});

// ✅ Store sederhana untuk menyimpan pesan (Persistent Store)
class PersistentStore {
  constructor(filename = "./store.json") {
    this.filename = filename;
    this.messages = existsSync(filename)
      ? JSON.parse(readFileSync(filename))
      : {};
  }

  saveMessage(msg) {
    const jid = msg.key.remoteJid;
    const id = msg.key.id;
    if (!this.messages[jid]) this.messages[jid] = {};
    this.messages[jid][id] = msg;
    this.saveToFile();
  }

  async loadMessage(jid, id) {
    return this.messages?.[jid]?.[id] || null;
  }

  saveToFile() {
    writeFileSync(this.filename, JSON.stringify(this.messages, null, 2));
  }

  bind(ev) {
    ev.on("messages.upsert", ({ messages }) => {
      for (let msg of messages) this.saveMessage(msg);
    });
  }
}

const store = new PersistentStore("./store.json");

// ✅ Inline connection handler
const handleConnectionUpdate = async (connectFunc, conn, update) => {
  const { connection, lastDisconnect } = update;

  if (connection === "close") {
    console.log("❌ Connection closed:", lastDisconnect?.error?.message);
    setTimeout(connectFunc, 5000); // Auto reconnect
  } else if (connection === "open") {
    console.log("✅ Bot connected to WhatsApp");
  } else if (connection === "connecting") {
    console.log("🔄 Connecting...");
  }
};

// 🔹 Koneksi WhatsApp
const connectToWhatsApp = async () => {
  await (await import("./message/database.js")).default();

  const session = "./session";
  const { state, saveCreds } = await useMultiFileAuthState(session);

  const getMessage = async (key) => {
    const msg = await store.loadMessage(key.remoteJid, key.id);
    return msg?.message || undefined;
  };

  global.conn = Socket({
    logger: logg({ level: "fatal" }),
    auth: state,
    printQRInTerminal: !pairingCode,
    browser: Browsers.ubuntu("Chrome"),
    getMessage,
    msgRetryCounterCache,
    syncFullHistory: true,
    markOnlineOnConnect: true,
  });

  store.bind(conn.ev);

  if (pairingCode && !conn.authState.creds.registered) {
    setTimeout(async () => {
      let code = await conn.requestPairingCode(global.pairingNumber);
      code = code?.match(/.{1,4}/g)?.join("-") || code;
      console.log(
        chalk.black(chalk.bgGreen(`Your Pairing Code : `)),
        chalk.black(chalk.white(code))
      );
    }, 3000);
  }

  conn.ev.process(async (events) => {
    if (events["connection.update"]) {
      if (db.data == null) await loadDatabase();
      const update = events["connection.update"];
      await handleConnectionUpdate(connectToWhatsApp, conn, update);
    }

    if (events["creds.update"]) await saveCreds();

    if (events["messages.upsert"]) {
      try {
        const chatUpdate = events["messages.upsert"];
        if (!chatUpdate.messages) return;
        let m = chatUpdate.messages[0];
        if (m.key.remoteJid === "status@broadcast") return;
        if (!m.message) return;
        if (m.key.id.startsWith("BAE5") && m.key.id.length === 16) return;

        const { register } = await import(`./message/register.js?v=${Date.now()}`);
        m = await smsg(conn, m);
        const { handler } = await import(`./handler.js?v=${Date.now()}`);
        await register(m);
        if (global.db.data) global.db.write();
        handler(conn, m, chatUpdate, store);
      } catch (err) {
        console.log(err);
        let e = util.format(err);
        conn.sendMessage(global.nomerOwner + "@s.whatsapp.net", { text: e });
      }
    }

    if (events.call) antiCall(db, events.call, conn);

    if (events["group-participants.update"]) {
      const anu = events["group-participants.update"];
      if (global.db.data == null) await loadDatabase();
      memberUpdate(conn, anu);
    }
  });

  // 🔹 Auto reload plugin
  const pluginFolder = path.join(__dirname, "./plugins");
  const pluginFilter = (filename) => /\.js$/.test(filename);
  global.plugins = {};

  async function filesInit(folderPath) {
    const files = readdirSync(folderPath);
    for (let file of files) {
      const filePath = join(folderPath, file);
      const fileStat = statSync(filePath);

      if (fileStat.isDirectory()) {
        await filesInit(filePath);
      } else if (pluginFilter(file)) {
        try {
          const module = await import("file://" + filePath);
          global.plugins[file] = module.default || module;
        } catch (e) {
          console.error(e);
          delete global.plugins[file];
        }
      }
    }
  }

  filesInit(pluginFolder);

  const watcher = chokidar.watch(pluginFolder, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    depth: 99,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
  });

  watcher.on("change", async (pathFile) => {
    if (pluginFilter(pathFile)) {
      const filename = pathFile.split("/").pop();
      console.log(
        chalk.bgGreen(chalk.black("[ UPDATE ]")),
        chalk.white(`${filename}`)
      );
      let err = syntaxerror(readFileSync(pathFile), filename, {
        sourceType: "module",
        allowAwaitOutsideFunction: true,
      });
      if (!err) {
        try {
          const module = await import(`${pathFile}?update=${Date.now()}`);
          global.plugins[filename] = module.default || module;
        } catch (e) {
          console.error(e);
        }
      }
    }
  });

  Function(conn);
  return conn;
};

connectToWhatsApp();

process.on("uncaughtException", (err) => {
  let e = String(err);
  if (
    e.includes("Socket connection timeout") ||
    e.includes("rate-overlimit") ||
    e.includes("Connection Closed") ||
    e.includes("Timed Out") ||
    e.includes("Value not found")
  )
    return;
  console.log("Caught exception: ", err);
});