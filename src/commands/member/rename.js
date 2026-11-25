import fs from "node:fs";
import { BOT_EMOJI, BOT_NAME, PREFIX } from "../../config.js";
import { DangerError, InvalidParameterError } from "../../errors/index.js";
import {
  createSticker,
  renameSticker,
} from "../../services/sticker.js";
import { getRandomName } from "../../utils/index.js";

function extractEmojis(text = "") {
  if (!text) return [];
  const segmenter = new Intl.Segmenter("pt", { granularity: "grapheme" });
  return [...segmenter.segment(text)]
    .map((s) => s.segment.trim())
    .filter((g) => g && /\p{Extended_Pictographic}/u.test(g))
    .slice(0, 5);
}

export function parseRenameArgs(args = [], defaultAuthor = `${BOT_EMOJI} ${BOT_NAME}`) {
  const pack = (args[0] || "").trim();
  const author = (args[1] || defaultAuthor || "").trim();
  const emojis = args[2] ? extractEmojis(args[2]) : [];

  return { pack, author, emojis };
}

export default {
  name: "rename",
  description:
    "Renomeia figurinhas (estáticas ou animadas) ou cria figurinha com pacote, autor e emojis personalizados.",
  commands: ["rename", "renomear", "rn"],
  usage: `${PREFIX}rename Pacote / Autor / 💙 (responda a uma figurinha, imagem ou vídeo)`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async (paramsHandler) => {
    const {
      isSticker,
      isImage,
      isVideo,
      downloadSticker,
      webMessage,
      sendWaitReact,
      sendSuccessReact,
      sendStickerFromFile,
      args,
      userLid,
    } = paramsHandler;

    if (!isSticker && !isImage && !isVideo) {
      throw new InvalidParameterError(
        `Você precisa responder a uma figurinha (ou enviar/responder imagem ou vídeo curto)!\n\n📌 *Exemplo:* ${PREFIX}rename Meu Pacote / ${BOT_NAME}`
      );
    }

    if (!args.length) {
      throw new InvalidParameterError(
        `Informe pelo menos o nome do pacote!\n\n📌 *Exemplos:*\n• ${PREFIX}rename Meu Pacote / Seu Nome\n• ${PREFIX}rename Meu Pacote / Seu Nome / 💙🔥\n• ${PREFIX}rename Meu Pacote`
      );
    }

    const fallbackAuthor =
      webMessage.pushName ||
      webMessage.notifyName ||
      userLid?.replace(/@lid/, "") ||
      `${BOT_EMOJI} ${BOT_NAME}`;

    const { pack, author, emojis } = parseRenameArgs(args, fallbackAuthor);

    const minLength = 1;
    const maxLength = 64;

    if (pack.length < minLength || pack.length > maxLength) {
      throw new DangerError(
        `O nome do pacote deve ter entre ${minLength} e ${maxLength} caracteres.`
      );
    }

    if (author.length < minLength || author.length > maxLength) {
      throw new DangerError(
        `O nome do autor deve ter entre ${minLength} e ${maxLength} caracteres.`
      );
    }

    await sendWaitReact();

    if (isImage || isVideo) {
      await createSticker({
        ...paramsHandler,
        customMetadata: {
          pack,
          author,
          emojis: emojis.length ? emojis : [BOT_EMOJI],
        },
      });
      await sendSuccessReact();
      return;
    }

    let inputPath = null;
    let finalStickerPath = null;

    try {
      inputPath = await downloadSticker(webMessage, getRandomName("webp"));

      finalStickerPath = await renameSticker(inputPath, {
        pack,
        author,
        emojis,
      });

      await sendSuccessReact();
      await sendStickerFromFile(finalStickerPath, true);
    } catch (error) {
      throw new Error(`Erro ao renomear a figurinha: ${error.message}`);
    } finally {
      if (inputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }

      if (finalStickerPath && fs.existsSync(finalStickerPath)) {
        fs.unlinkSync(finalStickerPath);
      }
    }
  },
};
