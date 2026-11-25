import { delay } from "baileys";
import fs from "node:fs";
import { BOT_EMOJI, BOT_NAME, PREFIX } from "../../config.js";
import { InvalidParameterError, WarningError } from "../../errors/index.js";
import {
  addStickerToPack,
  createPack,
  deletePack,
  exportPackArchive,
  getActivePack,
  getOwnerKey,
  getPackStickerFiles,
  listPacks,
  MAX_STICKERS_PER_PACK,
  removeStickerFromPack,
  renamePack,
  selectPack,
} from "../../services/sticker-pack.js";
import { convertMediaToStickerBuffer } from "../../services/sticker.js";
import { getRandomName } from "../../utils/index.js";

function splitSlashArgs(str = "") {
  return String(str)
    .split(/[\\|/]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getDefaultAuthor(webMessage, userLid) {
  return (
    webMessage.pushName ||
    webMessage.notifyName ||
    userLid?.replace(/@lid/, "") ||
    `${BOT_EMOJI} ${BOT_NAME}`
  );
}

export async function handleAddMediaToPack(paramsHandler, targetPackName = null) {
  const {
    isSticker,
    isImage,
    isVideo,
    downloadSticker,
    downloadImage,
    downloadVideo,
    webMessage,
    userLid,
    remoteJid,
    sendWaitReact,
    sendSuccessReply,
  } = paramsHandler;

  if (!isSticker && !isImage && !isVideo) {
    throw new InvalidParameterError(
      `Responda a uma figurinha, imagem ou vídeo curto para adicionar ao pacote!\n\n📌 *Exemplo:* ${PREFIX}pack add (ou ${PREFIX}padd)`
    );
  }

  await sendWaitReact();

  let downloadedPath = null;

  try {
    let webpBuffer;

    if (isSticker) {
      downloadedPath = await downloadSticker(webMessage, getRandomName("webp"));
      webpBuffer = await fs.promises.readFile(downloadedPath);
    } else if (isImage) {
      downloadedPath = await downloadImage(webMessage, getRandomName());
      webpBuffer = await convertMediaToStickerBuffer({
        isImage: true,
        isVideo: false,
        inputPath: downloadedPath,
      });
    } else {
      downloadedPath = await downloadVideo(webMessage, getRandomName());
      const seconds =
        webMessage.message?.videoMessage?.seconds ||
        webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
          ?.videoMessage?.seconds;

      webpBuffer = await convertMediaToStickerBuffer({
        isImage: false,
        isVideo: true,
        inputPath: downloadedPath,
        seconds,
      });
    }

    const ownerKey = getOwnerKey(userLid, remoteJid);
    const defaultAuthor = getDefaultAuthor(webMessage, userLid);

    const { pack, sticker, autoCreated } = await addStickerToPack(
      ownerKey,
      webpBuffer,
      {
        packName: targetPackName,
        defaultAuthor,
      }
    );

    const extraInfo = autoCreated
      ? `\n💠 Pacote criado automaticamente!`
      : "";

    await sendSuccessReply(
      `Figurinha adicionada ao pacote *${pack.name}*!${extraInfo}\n\n📦 *Pacote:* ${pack.name}\n✍️ *Autor:* ${pack.author}\n🧩 *Total:* ${pack.stickers.length}/${MAX_STICKERS_PER_PACK} ${sticker.isAnimated ? "(Animada)" : "(Estática)"}\n\n💡 Use *${PREFIX}pack enviar* para mandar todas renomeadas ou *${PREFIX}pack exportar* para gerar o arquivo do pacote.`
    );
  } finally {
    if (downloadedPath && fs.existsSync(downloadedPath)) {
      fs.unlinkSync(downloadedPath);
    }
  }
}

function buildHelpMessage(ownerKey) {
  const active = getActivePack(ownerKey);
  const statusLine = active
    ? `📦 *Pacote ativo:* ${active.name} (${active.stickers.length}/${MAX_STICKERS_PER_PACK} figurinhas) — _${active.author}_`
    : `📦 *Pacote ativo:* _Nenhum selecionado_`;

  return `🔵 *Criador de Pacotes de Figurinhas* 🔵

${statusLine}

💠 *Como montar seu pacote:*
├─ 🔹 ${PREFIX}pack novo Nome / Autor
├─ 🔹 ${PREFIX}pack add _(ou ${PREFIX}padd)_ — responda à figurinha/imagem/vídeo
├─ 🔹 ${PREFIX}pack renomear Novo Nome / Novo Autor — renomeia o pacote inteiro
├─ 🔹 ${PREFIX}pack enviar — envia todas já renomeadas com o mesmo Pack ID
├─ 🔹 ${PREFIX}pack exportar — gera arquivo *.wastickers* pronto para importar no celular
├─ 🔹 ${PREFIX}pack zip — gera arquivo *.zip* com todas as figurinhas
├─ 🔹 ${PREFIX}pack lista — lista seus pacotes
├─ 🔹 ${PREFIX}pack usar Nome — alterna o pacote ativo
├─ 🔹 ${PREFIX}pack remover 2 — remove a figurinha #2
└─ 🔹 ${PREFIX}pack apagar Nome — exclui um pacote`;
}

export default {
  name: "pack",
  description:
    "Cria pacotes completos de figurinhas, renomeia em lote e exporta em .wastickers/.zip.",
  commands: ["pack", "pacote", "stickerpack"],
  usage: `${PREFIX}pack (veja os subcomandos disponíveis)`,
  /**
   * @param {CommandHandleProps} paramsHandler
   */
  handle: async (paramsHandler) => {
    const {
      fullArgs,
      userLid,
      remoteJid,
      webMessage,
      sendReply,
      sendWaitReact,
      sendSuccessReact,
      sendSuccessReply,
      sendStickerFromFile,
      sendDocumentFromBuffer,
    } = paramsHandler;

    const ownerKey = getOwnerKey(userLid, remoteJid);
    const trimmedArgs = (fullArgs || "").trim();

    if (!trimmedArgs) {
      await sendReply(buildHelpMessage(ownerKey));
      return;
    }

    const firstSpace = trimmedArgs.indexOf(" ");
    const subCommand = (
      firstSpace === -1 ? trimmedArgs : trimmedArgs.slice(0, firstSpace)
    )
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const rest = firstSpace === -1 ? "" : trimmedArgs.slice(firstSpace + 1).trim();

    switch (subCommand) {
      case "novo":
      case "criar":
      case "new":
      case "create": {
        const [packName, authorName] = splitSlashArgs(rest);
        if (!packName) {
          throw new InvalidParameterError(
            `Informe o nome do pacote!\n\n📌 *Exemplo:* ${PREFIX}pack novo Minhas Brabas / ${BOT_NAME}`
          );
        }

        const { pack, created } = createPack(
          ownerKey,
          packName,
          authorName || getDefaultAuthor(webMessage, userLid)
        );

        await sendSuccessReply(
          created
            ? `Pacote *${pack.name}* criado e ativado!\n✍️ *Autor:* ${pack.author}\n\nAgora responda suas figurinhas com *${PREFIX}padd* ou *${PREFIX}pack add*.`
            : `Pacote *${pack.name}* já existia e foi selecionado como ativo (${pack.stickers.length}/${MAX_STICKERS_PER_PACK}).`
        );
        return;
      }

      case "add":
      case "adicionar": {
        await handleAddMediaToPack(paramsHandler, rest || null);
        return;
      }

      case "renomear":
      case "rename": {
        const [newName, newAuthor] = splitSlashArgs(rest);
        if (!newName) {
          throw new InvalidParameterError(
            `Informe o novo nome do pacote!\n\n📌 *Exemplo:* ${PREFIX}pack renomear Novo Pacote / Novo Autor`
          );
        }

        await sendWaitReact();
        const updated = await renamePack(ownerKey, newName, newAuthor || null);

        await sendSuccessReply(
          `Pacote renomeado com sucesso!\n\n📦 *Novo nome:* ${updated.name}\n✍️ *Novo autor:* ${updated.author}\n🧩 *Figurinhas atualizadas:* ${updated.stickers.length}`
        );
        return;
      }

      case "enviar":
      case "send": {
        const { pack, files } = getPackStickerFiles(ownerKey, rest || null);
        await sendWaitReact();
        await sendReply(
          `🔵 Enviando pacote *${pack.name}* (${files.length} figurinhas) — _${pack.author}_...`
        );

        for (let i = 0; i < files.length; i++) {
          await sendStickerFromFile(files[i].fullPath, i === 0);
          if (i < files.length - 1) {
            await delay(600);
          }
        }

        await sendSuccessReact();
        return;
      }

      case "exportar":
      case "wastickers":
      case "export":
      case "zip": {
        const format = subCommand === "zip" ? "zip" : "wastickers";
        await sendWaitReact();

        const result = await exportPackArchive(ownerKey, rest || null, format);
        await sendDocumentFromBuffer(
          result.buffer,
          result.mimetype,
          result.fileName,
          true
        );

        await sendSuccessReply(
          `Pacote *${result.pack.name}* exportado com ${result.count} figurinha(s)!\n📦 *Arquivo:* ${result.fileName}\n\n💡 _No celular, toque no arquivo e abra com o Sticker Maker / Personal Stickers para adicionar todas ao WhatsApp de uma vez!_`
        );
        return;
      }

      case "lista":
      case "listar":
      case "list":
      case "ver":
      case "info": {
        const { activePackId, packs } = listPacks(ownerKey);
        if (!packs.length) {
          throw new WarningError(
            `Você ainda não tem pacotes salvos. Crie um com *${PREFIX}pack novo Nome / Autor*!`
          );
        }

        const lines = packs.map((p, idx) => {
          const isActive = p.id === activePackId ? " *(ativo)* 💙" : "";
          return `${idx + 1}. *${p.name}*${isActive} — ${p.stickers.length}/${MAX_STICKERS_PER_PACK} figurinhas (${p.author})`;
        });

        await sendReply(`🔵 *Seus Pacotes de Figurinhas* 🔵\n\n${lines.join("\n")}`);
        return;
      }

      case "usar":
      case "selecionar":
      case "select": {
        if (!rest) {
          throw new InvalidParameterError(
            `Informe o nome ou número do pacote!\n\n📌 *Exemplo:* ${PREFIX}pack usar 1`
          );
        }

        const selected = selectPack(ownerKey, rest);
        await sendSuccessReply(
          `Pacote ativo alterado para *${selected.name}* (${selected.stickers.length}/${MAX_STICKERS_PER_PACK} figurinhas).`
        );
        return;
      }

      case "remover":
      case "remove":
      case "del": {
        if (!rest) {
          throw new InvalidParameterError(
            `Informe o número da figurinha a remover!\n\n📌 *Exemplo:* ${PREFIX}pack remover 1`
          );
        }

        const { pack } = removeStickerFromPack(ownerKey, rest);
        await sendSuccessReply(
          `Figurinha #${rest} removida de *${pack.name}*. Restam ${pack.stickers.length} figurinha(s).`
        );
        return;
      }

      case "apagar":
      case "limpar":
      case "delete": {
        const deleted = deletePack(ownerKey, rest || null);
        await sendSuccessReply(
          `Pacote *${deleted.name}* apagado com sucesso!`
        );
        return;
      }

      default: {
        await sendReply(buildHelpMessage(ownerKey));
      }
    }
  },
};
