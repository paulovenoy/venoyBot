import { downloadContentFromMessage } from "baileys";
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { BOT_EMOJI, BOT_NAME, PREFIX, TEMP_DIR } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { convertMediaToStickerBuffer } from "../../services/sticker.js";
import { getRandomName } from "../../utils/index.js";

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

async function extractVideoAudioToOgg(videoPath) {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const audioPath = path.resolve(TEMP_DIR, getRandomName("ogg"));
  try {
    await execAsync(
      `ffmpeg -y -i "${videoPath}" -vn -t 10 -c:a libopus -b:a 48k -ac 1 "${audioPath}"`
    );
    if (fs.existsSync(audioPath) && fs.statSync(audioPath).size > 0) {
      return audioPath;
    }
    safeUnlink(audioPath);
    return null;
  } catch {
    safeUnlink(audioPath);
    return null;
  }
}

async function downloadQuotedAudioFromImage(webMessage) {
  const quotedAudio =
    webMessage?.message?.imageMessage?.contextInfo?.quotedMessage
      ?.audioMessage;

  if (!quotedAudio) {
    return null;
  }

  const stream = await downloadContentFromMessage(quotedAudio, "audio");
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const audioPath = path.resolve(TEMP_DIR, getRandomName("ogg"));
  await fs.promises.writeFile(audioPath, Buffer.concat(chunks));
  return audioPath;
}

export default {
  name: "figsom",
  description:
    "Cria combo de figurinha + áudio a partir de vídeo com som ou imagem respondendo a um áudio.",
  commands: ["figsom", "stickersom", "somfig"],
  usage: `${PREFIX}figsom [Pacote / Autor] (envie/responda um vídeo com som, ou envie uma imagem com legenda respondendo um áudio)`,
  /**
   * @param {CommandHandleProps} paramsHandler
   */
  handle: async ({
    args,
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    userLid,
    sendWaitReact,
    sendSuccessReact,
    sendWarningReply,
    sendStickerFromFile,
    sendAudioFromFile,
  }) => {
    const quotedAudioFromImage = isImage
      ? await downloadQuotedAudioFromImage(webMessage)
      : null;

    if (!isVideo && !(isImage && quotedAudioFromImage)) {
      safeUnlink(quotedAudioFromImage);
      throw new InvalidParameterError(
        `Use *${PREFIX}figsom* de uma destas formas:\n\n` +
          `1️⃣ Envie ou responda a um *vídeo curto (até 10s)* com som.\n` +
          `2️⃣ Envie uma *imagem com legenda ${PREFIX}figsom* respondendo a um *áudio*.\n\n` +
          `💡 _Opcional:_ ${PREFIX}figsom Meu Pacote / Autor\n\n` +
          `ℹ️ _Nota:_ O bot envia a figurinha + áudio em seguida (combo), pois o protocolo Baileys ainda não suporta o áudio interno das figurinhas nativas do WhatsApp.`
      );
    }

    await sendWaitReact();

    const username =
      webMessage.pushName ||
      webMessage.notifyName ||
      userLid?.replace(/@lid/, "") ||
      "@paulovenoy";

    const metadata = {
      pack: (args[0] || username).trim(),
      author: (args[1] || `${BOT_EMOJI} ${BOT_NAME}`).trim(),
      emojis: ["🔊", BOT_EMOJI],
    };

    let mediaInputPath = null;
    let stickerOutputPath = null;
    let audioOutputPath = quotedAudioFromImage;

    try {
      if (isVideo) {
        mediaInputPath = await downloadVideo(webMessage, getRandomName());
        const seconds =
          webMessage.message?.videoMessage?.seconds ||
          webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.videoMessage?.seconds;

        const webpBuffer = await convertMediaToStickerBuffer({
          isImage: false,
          isVideo: true,
          inputPath: mediaInputPath,
          seconds,
          metadata,
        });

        stickerOutputPath = path.resolve(TEMP_DIR, getRandomName("webp"));
        await fs.promises.writeFile(stickerOutputPath, webpBuffer);

        audioOutputPath = await extractVideoAudioToOgg(mediaInputPath);
      } else {
        mediaInputPath = await downloadImage(webMessage, getRandomName());
        const webpBuffer = await convertMediaToStickerBuffer({
          isImage: true,
          isVideo: false,
          inputPath: mediaInputPath,
          metadata,
        });

        stickerOutputPath = path.resolve(TEMP_DIR, getRandomName("webp"));
        await fs.promises.writeFile(stickerOutputPath, webpBuffer);
      }

      await sendStickerFromFile(stickerOutputPath, true);

      if (audioOutputPath) {
        await sendAudioFromFile(audioOutputPath, true, false);
        await sendSuccessReact();
      } else {
        await sendWarningReply(
          "Figurinha animada enviada! Porém o vídeo não possuía trilha de áudio."
        );
      }
    } finally {
      safeUnlink(mediaInputPath);
      safeUnlink(stickerOutputPath);
      safeUnlink(audioOutputPath);
    }
  },
};
