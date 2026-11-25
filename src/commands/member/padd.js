import { PREFIX } from "../../config.js";
import { handleAddMediaToPack } from "./pack.js";

export default {
  name: "padd",
  description:
    "Atalho rápido para adicionar uma figurinha, imagem ou vídeo ao pacote ativo.",
  commands: ["padd", "addpack"],
  usage: `${PREFIX}padd (responda a uma figurinha, imagem ou vídeo)`,
  /**
   * @param {CommandHandleProps} paramsHandler
   */
  handle: async (paramsHandler) => {
    const packName = (paramsHandler.fullArgs || "").trim() || null;
    await handleAddMediaToPack(paramsHandler, packName);
  },
};
