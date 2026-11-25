/**
 * Serviços para processar e renomear figurinhas (stickers).
 *
 * @author MRX / Paulo Venoy
 */
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import webp from "node-webpmux";
import { BOT_EMOJI, BOT_NAME, TEMP_DIR } from "../config.js";
import { getRandomName, getRandomNumber } from "../utils/index.js";

const DEFAULT_PACK_NAME = "@paulovenoy";
const DEFAULT_PACK_AUTHOR = "VENOY ®";
const EXIF_HEADER = Buffer.from([
  0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
  0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
]);

function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

function getTempPath(extension = "webp") {
  ensureTempDir();
  return path.resolve(TEMP_DIR, getRandomName(extension));
}

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

function safeUnlink(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Monta o bloco EXIF padrão do WhatsApp para figurinhas WebP.
 */
export function buildStickerExifBuffer(metadata = {}) {
  const packId = String(
    metadata.packId || getRandomNumber(10_000, 99_999)
  );
  const packName = String(
    metadata.pack || metadata.username || DEFAULT_PACK_NAME
  ).trim();
  const packPublisher = String(
    metadata.author || metadata.botName || DEFAULT_PACK_AUTHOR
  ).trim();

  let emojis = [""];
  if (Array.isArray(metadata.emojis) && metadata.emojis.length > 0) {
    emojis = metadata.emojis;
  } else if (
    Array.isArray(metadata.categories) &&
    metadata.categories.length > 0
  ) {
    emojis = metadata.categories;
  }

  const json = {
    "sticker-pack-id": packId,
    "sticker-pack-name": packName || DEFAULT_PACK_NAME,
    "sticker-pack-publisher": packPublisher || DEFAULT_PACK_AUTHOR,
    emojis,
  };

  const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
  const exif = Buffer.concat([EXIF_HEADER, jsonBuff]);
  exif.writeUIntLE(jsonBuff.length, 14, 4);

  return exif;
}

/**
 * Lê metadados EXIF de uma figurinha WebP (Buffer ou caminho de arquivo).
 */
export async function readStickerMetadata(input) {
  let tempPath = null;

  try {
    const img = new webp.Image();

    if (Buffer.isBuffer(input)) {
      tempPath = getTempPath("webp");
      await fs.promises.writeFile(tempPath, input);
      await img.load(tempPath);
    } else {
      await img.load(input);
    }

    if (!img.exif || img.exif.length <= 22) {
      return null;
    }

    const rawText = img.exif.subarray(22).toString("utf-8");
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
      return null;
    }

    const parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
    return {
      packId: parsed["sticker-pack-id"] || null,
      pack: parsed["sticker-pack-name"] || null,
      author: parsed["sticker-pack-publisher"] || null,
      emojis: Array.isArray(parsed.emojis) ? parsed.emojis : [],
    };
  } catch {
    return null;
  } finally {
    safeUnlink(tempPath);
  }
}

/**
 * Aplica novos metadados EXIF em um Buffer WebP preservando frames e chunks originais.
 */
export async function applyStickerMetadataToBuffer(mediaBuffer, metadata = {}) {
  const tmpFileIn = getTempPath("webp");
  const tmpFileOut = getTempPath("webp");

  try {
    await fs.promises.writeFile(tmpFileIn, mediaBuffer);

    const img = new webp.Image();
    await img.load(tmpFileIn);
    img.exif = buildStickerExifBuffer(metadata);
    await img.save(tmpFileOut);

    return await fs.promises.readFile(tmpFileOut);
  } finally {
    safeUnlink(tmpFileIn);
    safeUnlink(tmpFileOut);
  }
}

/**
 * Grava novos metadados em um Buffer WebP e retorna o caminho do arquivo temporário gerado.
 */
export async function addStickerMetadata(media, metadata = {}) {
  const tmpFileIn = getTempPath("webp");
  const tmpFileOut = getTempPath("webp");

  try {
    await fs.promises.writeFile(tmpFileIn, media);

    const img = new webp.Image();
    await img.load(tmpFileIn);
    img.exif = buildStickerExifBuffer(metadata);
    await img.save(tmpFileOut);

    return tmpFileOut;
  } catch (error) {
    safeUnlink(tmpFileOut);
    throw error;
  } finally {
    safeUnlink(tmpFileIn);
  }
}

/**
 * Verifica se um arquivo WebP possui animação (chunks ANIM ou ANMF).
 */
export async function isAnimatedSticker(filePathOrBuffer) {
  try {
    const buffer = Buffer.isBuffer(filePathOrBuffer)
      ? filePathOrBuffer
      : await fs.promises.readFile(filePathOrBuffer);

    return (
      buffer.includes(Buffer.from("ANIM")) ||
      buffer.includes(Buffer.from("ANMF"))
    );
  } catch {
    return false;
  }
}

/**
 * Renomeia figurinhas estáticas ou animadas direto via node-webpmux,
 * sem re-encodar com FFmpeg e preservando transparência, frames e chunks extras.
 */
export async function renameSticker(inputPath, metadata = {}) {
  const existing = await readStickerMetadata(inputPath);
  const mergedMetadata = {
    ...metadata,
    emojis:
      Array.isArray(metadata.emojis) && metadata.emojis.length > 0
        ? metadata.emojis
        : existing?.emojis?.length
          ? existing.emojis
          : ["💙"],
  };

  const img = new webp.Image();
  await img.load(inputPath);
  img.exif = buildStickerExifBuffer(mergedMetadata);

  const finalPath = getTempPath("webp");
  await img.save(finalPath);
  return finalPath;
}

export async function processStaticSticker(inputPath, metadata = {}) {
  if (inputPath.toLowerCase().endsWith(".webp")) {
    return await renameSticker(inputPath, metadata);
  }

  const tempOutputPath = getTempPath("webp");

  try {
    const cmd = `ffmpeg -y -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000" -f webp -quality 90 "${tempOutputPath}"`;
    await execAsync(cmd);

    const processedBuffer = await fs.promises.readFile(tempOutputPath);
    return await addStickerMetadata(processedBuffer, metadata);
  } catch (error) {
    console.error("FFmpeg error:", error.message);
    throw new Error("Erro ao processar figurinha estática.");
  } finally {
    safeUnlink(tempOutputPath);
  }
}

export async function processAnimatedSticker(inputPath, metadata = {}) {
  try {
    return await renameSticker(inputPath, metadata);
  } catch (err) {
    console.error("Erro node-webpmux:", err);
    throw new Error("Erro ao processar figurinha animada.");
  }
}

/**
 * Converte imagem ou vídeo curto em Buffer WebP já com metadados EXIF aplicados.
 */
export async function convertMediaToStickerBuffer({
  isImage,
  isVideo,
  inputPath,
  seconds,
  metadata = {},
}) {
  const outputTempPath = getTempPath("webp");

  try {
    if (isImage) {
      const cmd = `ffmpeg -y -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -f webp -quality 90 "${outputTempPath}"`;
      await execAsync(cmd);
    } else if (isVideo) {
      const maxDuration = 10;
      if (typeof seconds === "number" && seconds > maxDuration) {
        throw new Error(
          `O vídeo enviado tem mais de ${maxDuration} segundos! Envie um vídeo menor.`
        );
      }

      const cmd = `ffmpeg -y -i "${inputPath}" -t ${maxDuration} -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -c:v libwebp -loop 0 -quality 50 -compression_level 6 -preset picture -an -f webp "${outputTempPath}"`;
      await execAsync(cmd);
    } else {
      throw new Error("Formato de mídia inválido para criar figurinha.");
    }

    if (!fs.existsSync(outputTempPath)) {
      throw new Error("Arquivo de saída não foi criado pelo FFmpeg.");
    }

    const rawWebp = await fs.promises.readFile(outputTempPath);
    return await applyStickerMetadataToBuffer(rawWebp, metadata);
  } finally {
    safeUnlink(outputTempPath);
  }
}

async function downloadWithRetries(downloadFn, webMessage, label) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await downloadFn(webMessage, getRandomName());
    } catch (downloadError) {
      console.error(
        `Tentativa ${attempt} de download de ${label} falhou:`,
        downloadError.message
      );

      if (attempt === 3) {
        throw new Error(
          `Falha ao baixar ${label} após 3 tentativas: ${downloadError.message}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
}

export async function createSticker(paramsHandler) {
  const {
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    sendStickerFromFile,
    userLid,
    customMetadata,
  } = paramsHandler;

  const username =
    webMessage.pushName ||
    webMessage.notifyName ||
    userLid?.replace(/@lid/, "") ||
    DEFAULT_PACK_NAME;

  const metadata = customMetadata || {
    pack: username,
    author: `${BOT_EMOJI} ${BOT_NAME}`,
    emojis: [BOT_EMOJI],
  };

  let inputPath = null;
  let stickerPath = null;

  try {
    if (isImage) {
      inputPath = await downloadWithRetries(downloadImage, webMessage, "imagem");
    } else if (isVideo) {
      inputPath = await downloadWithRetries(downloadVideo, webMessage, "vídeo");
    }

    const seconds =
      webMessage.message?.videoMessage?.seconds ||
      webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.videoMessage?.seconds;

    const webpBuffer = await convertMediaToStickerBuffer({
      isImage,
      isVideo,
      inputPath,
      seconds,
      metadata,
    });

    stickerPath = getTempPath("webp");
    await fs.promises.writeFile(stickerPath, webpBuffer);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await sendStickerFromFile(stickerPath, true);
        break;
      } catch (stickerError) {
        console.error(
          `Tentativa ${attempt} de envio de sticker falhou:`,
          stickerError.message
        );

        if (attempt === 3) {
          throw new Error(
            `Falha ao enviar figurinha após 3 tentativas: ${stickerError.message}`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  } catch (error) {
    if (
      error.message.includes("ETIMEDOUT") ||
      error.message.includes("AggregateError") ||
      error.message.includes("getaddrinfo ENOTFOUND") ||
      error.message.includes("connect ECONNREFUSED") ||
      error.message.includes("mmg.whatsapp.net")
    ) {
      throw new Error(
        "Erro de conexão ao baixar mídia do WhatsApp. Tente novamente em alguns segundos."
      );
    }

    if (error.message.includes("FFmpeg")) {
      throw new Error(
        "Erro ao processar mídia com FFmpeg. Verifique se o arquivo não está corrompido."
      );
    }

    throw error;
  } finally {
    safeUnlink(inputPath);
    safeUnlink(stickerPath);
  }
}

export async function processAutoSticker(paramsHandler) {
  const { isImage, isVideo, sendSuccessReact } = paramsHandler;

  if (!isImage && !isVideo) {
    return false;
  }

  try {
    await createSticker(paramsHandler);
    await sendSuccessReact();

    return true;
  } catch (error) {
    console.error("Erro no processamento automático de sticker:", error);
    return false;
  }
}
