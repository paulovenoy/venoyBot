/**
 * Testes para serviços de figurinha, renomeação, pacotes e tema azul.
 */
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";
import { parseRenameArgs } from "../commands/member/rename.js";
import { ASSETS_DIR, BOT_EMOJI } from "../config.js";
import { menuMessage } from "../menu.js";
import {
  addStickerToPack,
  createPack,
  deletePack,
  exportPackArchive,
  getPackStickerFiles,
  listPacks,
  removeStickerFromPack,
  renamePack,
  selectPack,
} from "../services/sticker-pack.js";
import {
  addStickerMetadata,
  buildStickerExifBuffer,
  readStickerMetadata,
  renameSticker,
} from "../services/sticker.js";
import { createZipBuffer, generateBlueTrayPng } from "../utils/zip.js";

const sampleStickerPath = path.resolve(
  ASSETS_DIR,
  "samples",
  "sample-sticker.webp"
);

describe("Blue Theme & Menu", () => {
  it("should use blue heart emoji in config", () => {
    assert.strictEqual(BOT_EMOJI, "💙");
  });

  it("should render menu with blue theme and new pack commands", () => {
    const menu = menuMessage("123456@g.us");
    assert.ok(menu.includes("🔵"));
    assert.ok(menu.includes("💙"));
    assert.ok(!menu.includes("🟢"));
    assert.ok(!menu.includes("💚"));
    assert.ok(menu.includes("pack"));
    assert.ok(menu.includes("padd"));
    assert.ok(menu.includes("figsom"));
    assert.ok(menu.includes("rename"));
  });
});

describe("Sticker Metadata & Rename", () => {
  const tempFiles = [];

  after(() => {
    for (const file of tempFiles) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    }
  });

  it("should build EXIF buffer with custom pack, author, packId and emojis", () => {
    const exif = buildStickerExifBuffer({
      packId: "pack_123",
      pack: "Pacote Azul",
      author: "Paulo Venoy",
      emojis: ["💙", "🔥"],
    });

    const json = JSON.parse(exif.subarray(22).toString("utf8"));
    assert.strictEqual(json["sticker-pack-id"], "pack_123");
    assert.strictEqual(json["sticker-pack-name"], "Pacote Azul");
    assert.strictEqual(json["sticker-pack-publisher"], "Paulo Venoy");
    assert.deepStrictEqual(json.emojis, ["💙", "🔥"]);
  });

  it("should actually rename a real WebP sticker via renameSticker without FFmpeg", async () => {
    const outputPath = await renameSticker(sampleStickerPath, {
      packId: "custom_999",
      pack: "Meu Pacote Novo",
      author: "Autor Teste",
      emojis: ["💙"],
    });
    tempFiles.push(outputPath);

    assert.ok(fs.existsSync(outputPath));
    const meta = await readStickerMetadata(outputPath);
    assert.ok(meta);
    assert.strictEqual(meta.packId, "custom_999");
    assert.strictEqual(meta.pack, "Meu Pacote Novo");
    assert.strictEqual(meta.author, "Autor Teste");
    assert.deepStrictEqual(meta.emojis, ["💙"]);
  });

  it("should write custom metadata in addStickerMetadata", async () => {
    const sampleBuffer = fs.readFileSync(sampleStickerPath);
    const outputPath = await addStickerMetadata(sampleBuffer, {
      pack: "Pack Direto",
      author: "Venoy Blue",
      emojis: ["⚡"],
    });
    tempFiles.push(outputPath);

    const meta = await readStickerMetadata(outputPath);
    assert.strictEqual(meta.pack, "Pack Direto");
    assert.strictEqual(meta.author, "Venoy Blue");
    assert.deepStrictEqual(meta.emojis, ["⚡"]);
  });

  it("should parse rename args with optional author and emojis", () => {
    assert.deepStrictEqual(parseRenameArgs(["Só Pacote"], "Autor Padrão"), {
      pack: "Só Pacote",
      author: "Autor Padrão",
      emojis: [],
    });

    assert.deepStrictEqual(
      parseRenameArgs(["Pacote X", "Autor Y", "💙🔥"], "Autor Padrão"),
      {
        pack: "Pacote X",
        author: "Autor Y",
        emojis: ["💙", "🔥"],
      }
    );
  });
});

describe("ZIP & Sticker Pack Service", () => {
  const testPacksDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "venoy-packs-test-")
  );
  const owner = "5511999999999@lid";

  after(() => {
    if (fs.existsSync(testPacksDir)) {
      fs.rmSync(testPacksDir, { recursive: true, force: true });
    }
  });

  it("should generate valid PNG tray icon and ZIP archive", () => {
    const png = generateBlueTrayPng(96);
    assert.deepStrictEqual(
      png.subarray(0, 8),
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    );

    const zip = createZipBuffer([
      { name: "hello.txt", data: Buffer.from("venoy-blue", "utf8") },
    ]);
    assert.strictEqual(zip.readUInt32LE(0), 0x04034b50);
    assert.ok(zip.includes(Buffer.from("hello.txt", "utf8")));
  });

  it("should create pack, add stickers with shared packId, rename all, and export .wastickers", async () => {
    const sampleBuffer = fs.readFileSync(sampleStickerPath);

    const { pack, created } = createPack(
      owner,
      "Zaps com Som",
      "Paulo Venoy",
      testPacksDir
    );
    assert.strictEqual(created, true);
    assert.strictEqual(pack.name, "Zaps com Som");

    await addStickerToPack(owner, sampleBuffer, { emojis: ["🔊"] }, testPacksDir);
    await addStickerToPack(owner, sampleBuffer, { emojis: ["💙"] }, testPacksDir);

    const { files } = getPackStickerFiles(owner, null, testPacksDir);
    assert.strictEqual(files.length, 2);

    const meta1 = await readStickerMetadata(files[0].fullPath);
    const meta2 = await readStickerMetadata(files[1].fullPath);
    assert.strictEqual(meta1.packId, pack.id);
    assert.strictEqual(meta2.packId, pack.id);
    assert.strictEqual(meta1.pack, "Zaps com Som");

    const renamed = await renamePack(
      owner,
      "Pacote Azul Top",
      "Venoy Studio",
      null,
      testPacksDir
    );
    assert.strictEqual(renamed.name, "Pacote Azul Top");

    const metaAfterRename = await readStickerMetadata(files[0].fullPath);
    assert.strictEqual(metaAfterRename.pack, "Pacote Azul Top");
    assert.strictEqual(metaAfterRename.author, "Venoy Studio");
    assert.strictEqual(metaAfterRename.packId, pack.id);

    const exported = await exportPackArchive(
      owner,
      null,
      "wastickers",
      testPacksDir
    );
    assert.strictEqual(exported.fileName, "pacote_azul_top.wastickers");
    assert.strictEqual(exported.buffer.readUInt32LE(0), 0x04034b50);
    assert.ok(exported.buffer.includes(Buffer.from("contents.json", "utf8")));
    assert.ok(exported.buffer.includes(Buffer.from("01.webp", "utf8")));
    assert.ok(exported.buffer.includes(Buffer.from("02.webp", "utf8")));

    removeStickerFromPack(owner, 1, null, testPacksDir);
    assert.strictEqual(
      getPackStickerFiles(owner, null, testPacksDir).files.length,
      1
    );

    selectPack(owner, 1, testPacksDir);
    assert.strictEqual(listPacks(owner, testPacksDir).packs.length, 1);

    deletePack(owner, null, testPacksDir);
    assert.strictEqual(listPacks(owner, testPacksDir).packs.length, 0);
  });
});
