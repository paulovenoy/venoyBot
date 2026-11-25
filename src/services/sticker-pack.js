/**
 * Serviço para criar, gerenciar, renomear e exportar pacotes de figurinhas.
 */
import { exec } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { BOT_EMOJI, BOT_NAME, DATABASE_DIR, TEMP_DIR } from "../config.js";
import { getRandomName } from "../utils/index.js";
import { createZipBuffer, generateBlueTrayPng } from "../utils/zip.js";
import {
  applyStickerMetadataToBuffer,
  isAnimatedSticker,
  readStickerMetadata,
} from "./sticker.js";

export const MAX_STICKERS_PER_PACK = 30;
const DEFAULT_PACKS_DIR = path.resolve(DATABASE_DIR, "sticker-packs");

function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function getStorePaths(baseDir = DEFAULT_PACKS_DIR) {
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const indexPath = path.resolve(baseDir, "packs.json");
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, JSON.stringify({ users: {} }, null, 2), "utf8");
  }

  return { baseDir, indexPath };
}

function readStore(baseDir = DEFAULT_PACKS_DIR) {
  const { indexPath } = getStorePaths(baseDir);
  try {
    const parsed = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    return parsed && typeof parsed === "object" && parsed.users
      ? parsed
      : { users: {} };
  } catch {
    return { users: {} };
  }
}

function writeStore(data, baseDir = DEFAULT_PACKS_DIR) {
  const { indexPath } = getStorePaths(baseDir);
  fs.writeFileSync(indexPath, JSON.stringify(data, null, 2), "utf8");
}

function ensureUserBucket(store, ownerKey) {
  if (!store.users[ownerKey]) {
    store.users[ownerKey] = {
      activePackId: null,
      packs: [],
    };
  }
  return store.users[ownerKey];
}

function findPack(bucket, targetNameOrIndex) {
  if (!bucket.packs.length) {
    return null;
  }

  if (!targetNameOrIndex) {
    return (
      bucket.packs.find((p) => p.id === bucket.activePackId) || bucket.packs[0]
    );
  }

  const trimmed = String(targetNameOrIndex).trim();
  const numericIndex = Number(trimmed);
  if (Number.isInteger(numericIndex) && numericIndex >= 1) {
    const byIndex = bucket.packs[numericIndex - 1];
    if (byIndex) return byIndex;
  }

  const lower = trimmed.toLowerCase();
  return (
    bucket.packs.find((p) => p.name.toLowerCase() === lower) ||
    bucket.packs.find((p) => p.name.toLowerCase().includes(lower)) ||
    null
  );
}

function generatePackId() {
  return `venoy_${crypto.randomBytes(4).toString("hex")}`;
}

export function getOwnerKey(userLid, remoteJid) {
  const raw = userLid || remoteJid || "default";
  return String(raw).replace(/[^a-zA-Z0-9@._-]/g, "_");
}

export function createPack(
  ownerKey,
  name,
  author = `${BOT_EMOJI} ${BOT_NAME}`,
  baseDir = DEFAULT_PACKS_DIR
) {
  const cleanName = String(name || "").trim();
  const cleanAuthor = String(author || `${BOT_EMOJI} ${BOT_NAME}`).trim();

  if (!cleanName) {
    throw new Error("Informe um nome válido para o pacote.");
  }

  const store = readStore(baseDir);
  const bucket = ensureUserBucket(store, ownerKey);

  const existing = bucket.packs.find(
    (p) => p.name.toLowerCase() === cleanName.toLowerCase()
  );
  if (existing) {
    bucket.activePackId = existing.id;
    writeStore(store, baseDir);
    return { pack: existing, created: false };
  }

  const packId = generatePackId();
  const packDir = path.resolve(baseDir, packId);
  fs.mkdirSync(packDir, { recursive: true });

  const newPack = {
    id: packId,
    name: cleanName,
    author: cleanAuthor,
    createdAt: new Date().toISOString(),
    stickers: [],
  };

  bucket.packs.push(newPack);
  bucket.activePackId = packId;
  writeStore(store, baseDir);

  return { pack: newPack, created: true };
}

export function listPacks(ownerKey, baseDir = DEFAULT_PACKS_DIR) {
  const store = readStore(baseDir);
  const bucket = ensureUserBucket(store, ownerKey);

  return {
    activePackId: bucket.activePackId,
    packs: bucket.packs,
  };
}

export function getActivePack(ownerKey, baseDir = DEFAULT_PACKS_DIR) {
  const store = readStore(baseDir);
  const bucket = ensureUserBucket(store, ownerKey);
  return findPack(bucket, null);
}

export function selectPack(
  ownerKey,
  targetNameOrIndex,
  baseDir = DEFAULT_PACKS_DIR
) {
  const store = readStore(baseDir);
  const bucket = ensureUserBucket(store, ownerKey);
  const pack = findPack(bucket, targetNameOrIndex);

  if (!pack) {
    throw new Error(`Pacote "${targetNameOrIndex}" não encontrado.`);
  }

  bucket.activePackId = pack.id;
  writeStore(store, baseDir);
  return pack;
}

export async function addStickerToPack(
  ownerKey,
  webpBuffer,
  { emojis = [], packName = null, defaultAuthor = `${BOT_EMOJI} ${BOT_NAME}` } = {},
  baseDir = DEFAULT_PACKS_DIR
) {
  const store = readStore(baseDir);
  const bucket = ensureUserBucket(store, ownerKey);

  let pack = findPack(bucket, packName);
  let autoCreated = false;

  if (!pack) {
    const created = createPack(
      ownerKey,
      packName || `Pacote Venoy ${BOT_EMOJI}`,
      defaultAuthor,
      baseDir
    );
    return await addStickerToPack(
      ownerKey,
      webpBuffer,
      { emojis, packName: created.pack.name, defaultAuthor },
      baseDir
    ).then((res) => ({ ...res, autoCreated: true }));
  }

  if (pack.stickers.length >= MAX_STICKERS_PER_PACK) {
    throw new Error(
      `O pacote "${pack.name}" já atingiu o limite de ${MAX_STICKERS_PER_PACK} figurinhas do WhatsApp! Crie um novo com /pack novo.`
    );
  }

  const existingMeta = await readStickerMetadata(webpBuffer);
  const finalEmojis =
    emojis.length > 0
      ? emojis
      : existingMeta?.emojis?.length
        ? existingMeta.emojis
        : [BOT_EMOJI];

  const stampedBuffer = await applyStickerMetadataToBuffer(webpBuffer, {
    packId: pack.id,
    pack: pack.name,
    author: pack.author,
    emojis: finalEmojis,
  });

  const animated = await isAnimatedSticker(stampedBuffer);
  const nextNumber = String(pack.stickers.length + 1).padStart(2, "0");
  const fileName = `sticker_${nextNumber}_${Date.now()}.webp`;
  const packDir = path.resolve(baseDir, pack.id);
  fs.mkdirSync(packDir, { recursive: true });

  await fs.promises.writeFile(path.resolve(packDir, fileName), stampedBuffer);

  pack.stickers.push({
    fileName,
    isAnimated: animated,
    emojis: finalEmojis,
    addedAt: new Date().toISOString(),
  });

  bucket.activePackId = pack.id;
  writeStore(store, baseDir);

  return {
    pack,
    sticker: pack.stickers[pack.stickers.length - 1],
    autoCreated,
  };
}

export async function renamePack(
  ownerKey,
  newName,
  newAuthor,
  targetNameOrIndex = null,
  baseDir = DEFAULT_PACKS_DIR
) {
  const store = readStore(baseDir);
  const bucket = ensureUserBucket(store, ownerKey);
  const pack = findPack(bucket, targetNameOrIndex);

  if (!pack) {
    throw new Error("Você ainda não possui nenhum pacote criado.");
  }

  const finalName = String(newName || pack.name).trim();
  const finalAuthor = String(newAuthor || pack.author).trim();

  pack.name = finalName;
  pack.author = finalAuthor;

  const packDir = path.resolve(baseDir, pack.id);
  for (const sticker of pack.stickers) {
    const filePath = path.resolve(packDir, sticker.fileName);
    if (!fs.existsSync(filePath)) continue;

    const currentBuffer = await fs.promises.readFile(filePath);
    const updatedBuffer = await applyStickerMetadataToBuffer(currentBuffer, {
      packId: pack.id,
      pack: finalName,
      author: finalAuthor,
      emojis: sticker.emojis?.length ? sticker.emojis : [BOT_EMOJI],
    });
    await fs.promises.writeFile(filePath, updatedBuffer);
  }

  writeStore(store, baseDir);
  return pack;
}

export function removeStickerFromPack(
  ownerKey,
  oneBasedIndex,
  targetNameOrIndex = null,
  baseDir = DEFAULT_PACKS_DIR
) {
  const store = readStore(baseDir);
  const bucket = ensureUserBucket(store, ownerKey);
  const pack = findPack(bucket, targetNameOrIndex);

  if (!pack) {
    throw new Error("Pacote não encontrado.");
  }

  const idx = Number(oneBasedIndex) - 1;
  if (!Number.isInteger(idx) || idx < 0 || idx >= pack.stickers.length) {
    throw new Error(
      `Índice inválido. O pacote "${pack.name}" possui ${pack.stickers.length} figurinha(s).`
    );
  }

  const [removed] = pack.stickers.splice(idx, 1);
  const filePath = path.resolve(baseDir, pack.id, removed.fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  writeStore(store, baseDir);
  return { pack, removed };
}

export function deletePack(
  ownerKey,
  targetNameOrIndex = null,
  baseDir = DEFAULT_PACKS_DIR
) {
  const store = readStore(baseDir);
  const bucket = ensureUserBucket(store, ownerKey);
  const pack = findPack(bucket, targetNameOrIndex);

  if (!pack) {
    throw new Error("Pacote não encontrado.");
  }

  const packDir = path.resolve(baseDir, pack.id);
  if (fs.existsSync(packDir)) {
    fs.rmSync(packDir, { recursive: true, force: true });
  }

  bucket.packs = bucket.packs.filter((p) => p.id !== pack.id);
  if (bucket.activePackId === pack.id) {
    bucket.activePackId = bucket.packs[0]?.id || null;
  }

  writeStore(store, baseDir);
  return pack;
}

export function getPackStickerFiles(
  ownerKey,
  targetNameOrIndex = null,
  baseDir = DEFAULT_PACKS_DIR
) {
  const store = readStore(baseDir);
  const bucket = ensureUserBucket(store, ownerKey);
  const pack = findPack(bucket, targetNameOrIndex);

  if (!pack) {
    throw new Error("Você ainda não possui nenhum pacote criado.");
  }

  const packDir = path.resolve(baseDir, pack.id);
  const files = pack.stickers
    .map((sticker) => ({
      ...sticker,
      fullPath: path.resolve(packDir, sticker.fileName),
    }))
    .filter((item) => fs.existsSync(item.fullPath));

  if (!files.length) {
    throw new Error(`O pacote "${pack.name}" está vazio!`);
  }

  return { pack, files };
}

async function createTrayIconBuffer(firstStickerPath) {
  if (firstStickerPath && fs.existsSync(firstStickerPath)) {
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
    const tempTrayPath = path.resolve(TEMP_DIR, getRandomName("png"));
    try {
      await execAsync(
        `ffmpeg -y -i "${firstStickerPath}" -vframes 1 -vf "scale=96:96:force_original_aspect_ratio=decrease,pad=96:96:(ow-iw)/2:(oh-ih)/2:color=0x00000000" "${tempTrayPath}"`
      );
      if (fs.existsSync(tempTrayPath)) {
        const pngBuffer = await fs.promises.readFile(tempTrayPath);
        fs.unlinkSync(tempTrayPath);
        return pngBuffer;
      }
    } catch {
      if (fs.existsSync(tempTrayPath)) {
        fs.unlinkSync(tempTrayPath);
      }
    }
  }

  return generateBlueTrayPng(96);
}

/**
 * Empacota todas as figurinhas do pacote em um arquivo .wastickers (ou .zip)
 * compatível com importadores de pacotes do WhatsApp.
 */
export async function exportPackArchive(
  ownerKey,
  targetNameOrIndex = null,
  format = "wastickers",
  baseDir = DEFAULT_PACKS_DIR
) {
  const { pack, files } = getPackStickerFiles(ownerKey, targetNameOrIndex, baseDir);
  const trayBuffer = await createTrayIconBuffer(files[0]?.fullPath);

  const entries = [{ name: "tray.png", data: trayBuffer }];
  const manifestImages = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const archiveFileName = `${String(i + 1).padStart(2, "0")}.webp`;
    const stickerData = await fs.promises.readFile(file.fullPath);

    entries.push({ name: archiveFileName, data: stickerData });
    manifestImages.push({
      image_file: archiveFileName,
      emojis: file.emojis?.length ? file.emojis : [BOT_EMOJI],
    });
  }

  const contentsJson = {
    android_play_store_link: "",
    ios_app_store_link: "",
    sticker_packs: [
      {
        identifier: pack.id,
        name: pack.name,
        publisher: pack.author,
        tray_image_file: "tray.png",
        publisher_website: "",
        privacy_policy_website: "",
        license_agreement_website: "",
        images: manifestImages,
      },
    ],
  };

  entries.push({
    name: "contents.json",
    data: Buffer.from(JSON.stringify(contentsJson, null, 2), "utf8"),
  });

  // Metadados simples compatíveis com aplicativos .wastickers (title.txt / author.txt)
  entries.push({ name: "title.txt", data: Buffer.from(pack.name, "utf8") });
  entries.push({ name: "author.txt", data: Buffer.from(pack.author, "utf8") });

  const safeSlug =
    pack.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase() || "venoy_pack";

  const ext = format === "zip" ? "zip" : "wastickers";

  return {
    pack,
    count: files.length,
    buffer: createZipBuffer(entries),
    fileName: `${safeSlug}.${ext}`,
    mimetype: "application/zip",
  };
}
