<div align="center">

# 🤖 Venoy Bot 💚

<p align="center">
  <img src="./assets/images/venoy-bot.png" alt="Venoy Bot Preview" width="750px" style="border-radius: 12px;" />
</p>

[![Versão](https://img.shields.io/badge/Versão-7.9.0-10B981?style=for-the-badge&labelColor=0B0F17)](https://github.com/paulovenoy/venoyBot)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-059669?style=for-the-badge&logo=node.js&labelColor=0B0F17)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-7.0.0--rc.9-25D366?style=for-the-badge&logo=whatsapp&labelColor=0B0F17)](https://github.com/WhiskeySockets/Baileys)
[![Licença](https://img.shields.io/badge/Licença-GPL--3.0-16A34A?style=for-the-badge&labelColor=0B0F17)](./LICENSE)

<p align="center">
  <b>💚 Bot multifuncional inteligente para WhatsApp com Baileys v7, automação de mídia, stickers e IA.</b>
</p>

</div>

---

## 📋 Sumário

- [☘️ Sobre o Projeto](#️-sobre-o-projeto)
- [⚡ Recursos e Destaques](#-recursos-e-destaques)
- [📱 Instalação no Termux](#-instalação-no-termux)
- [🖥️ Instalação em VPS (Debian/Ubuntu)](#️-instalação-em-vps-debianubuntu)
- [🦅 Hospedagem no Painel Pterodactyl](#-hospedagem-no-painel-pterodactyl)
- [⚙️ Configurações (`src/config.js`)](#️-configurações-srcconfigjs)
- [🤖 Auto Responder](#-auto-responder)
- [📚 Catálogo de Comandos](#-catálogo-de-comandos)
- [🤝 Contribuição e Licença](#-contribuição-e-licença)

---

## ☘️ Sobre o Projeto

O **Venoy Bot** foi projetado com foco em arquitetura orientada a arquivos (File-Oriented Architecture), dispensando gigantescos arquivos de `switch/case`. Cada comando possui seu próprio módulo, com controle automático de permissões por diretório:

- 👑 **`src/commands/owner/`** → Funcionalidades exclusivas do dono do bot.
- 🛡️ **`src/commands/admin/`** → Gerenciamento e moderação de grupos.
- 🟢 **`src/commands/member/`** → Comandos públicos, downloads, IA, canvas e utilitários.

---

## ⚡ Recursos e Destaques

- 💚 **Menu Dinâmico & Moderno**: Exibição organizada com tema verde e indicadores em tempo real.
- 📶 **Métricas de Performance (`/ping`)**: Latência, Uptime do processo, consumo de memória RAM (MB) e versão do Node.
- 🤖 **Inteligência Artificial Nativa**: Suporte a modelos Google Gemini, GPT-5 Mini, geração de imagens via Flux e figurinhas com IA.
- 📥 **Central de Downloads**: Baixe vídeos e áudios do TikTok, YouTube, Instagram, Facebook e Pinterest.
- 🎨 **Canvas e Edição de Imagens**: Filtros de imagem em tempo real (blur, invert, gray, rip, molduras).
- 🛡️ **Sistemas Anti-Spam & Moderação**: Anti-link, anti-imagem, anti-vídeo, anti-áudio, anti-documento, anti-sticker e apenas-admin.

---

## 📱 Instalação no Termux

1. Abra o Termux e atualize os pacotes do sistema:

```sh
pkg upgrade -y && pkg update -y && pkg install git nodejs-lts ffmpeg -y
```

2. Permita o acesso ao armazenamento interno:

```sh
termux-setup-storage
```

3. Navegue até a pasta desejada e clone o repositório:

```sh
cd /sdcard
git clone https://github.com/paulovenoy/venoyBot.git
cd venoyBot
```

4. Instale as dependências e inicie o bot:

```sh
npm install
npm start
```

5. Digite o seu número de telefone quando solicitado e insira o **código de pareamento** no seu WhatsApp (Configurações > Dispositivos Conectados > Conectar com número).

---

## 🖥️ Instalação em VPS (Debian/Ubuntu)

1. Atualize o sistema e instale as dependências principais:

```sh
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ffmpeg build-essential
```

2. Instale o Node.js v22 via NVM:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 22
```

Lembre-se de trocar os números acima pelos seus números, obviamente e tbm ver se o seu prefixo é a barra /.

24 - Por fim, teste o bot!

![tutorial-vps-9](./assets/images/tutorial-vps-9.png)

## Diagrama de conexão

[![diagram](https://mermaid.ink/img/pako:eNqdVc1u1DAQfpWpJSSQtqX7k_2JoChse-hh26qtWlTtxZtMs4bEXhxnVVpV4gDcOLQUDgipQnBAiBs3OO6b8AR9BMbJZvu3BYQPVmx_M558M9_4gPkqQOayBJ-mKH1cFDzUPO5KoMFTo2Qa91Dn6wHXRvhiwKWBRRwCT-Ds9OjLr-evz06Pf8KW8kdfryMfKpMjP7-DTf4Ek76we9eB216OO_4G231uEm8w6MoctqIMghqitveWtj2XYO-fQ1vFCtTEq68k-oaDVBMHDwoPt27B_cmAtfXlztLyugdbSzsX9nOoJiegw97tSnW-BJWanRznTn54UzSv3sKaFjEKzWGI-6BVwGVgo-sV_2rH-ReZzi4sEBEuyEEMiSEmzk9pn04J40KXLYpQ2BtBjn7EqBUEmVd7NNWf45TLrWJMuzv3bgNfwwDBH30PREhu0eYDeYzSqHP0tjdbeF5Ho7TkE4vbuOdCuVKtzTr1RvPO1PjPTk-OoKMSoyd2F2ymhXeJXxe8Hlmep9Sm18cojbi-19N3F7ZGHwFj4sKzwUd9lVBdZIUQqKTLMkw7ElTfOWx8qKHAjzETloufi7OYA3Vz9iyDvz68hPbYggpwV-iYbC4EeYnIMY82hr3RJ5VJTIt9HvCZq-RlwA0eDYk2TWmSvuAi-TNfmY2N6OHqJrRXV5bam97i6kz2f16oiEeMEIZ8opWcQhtFzEmIWeoREowHGvMLUAY3aWj05tFyx9uwIlra-IOMxgrKtPQXGZ28gBVqAgM9-r4nYvoiLWHyv_rJueZaY3iJREgsrck0QYyrA65QMlUNWeqLUpv5x8ysra-ubI5TYlvjY1u-iaFZyUhIzA4QeJhynbcQCiDhIU0XEgJTByuxUIuAuUanWGLUK2Jul-zAWnSZ6WOMXWYbR4C7PI2M7SCHZEYNeEepuLDUKg37zN3lUUKrdBBwUzwNk11NgaBuq1Qa5pZbzUrmhbkHbI_WzfpcrdGq1eabTtNpVSrVEnvG3Mb8XKPpVKpVakx1p1FvHpbYfnZvea5RL9drjfK8UynXW80Sw0CQNjr5-5Q9U4e_ARz-Fnw?type=png)](https://mermaid.live/edit#pako:eNqdVc1u1DAQfpWpJSSQtqX7k_2JoChse-hh26qtWlTtxZtMs4bEXhxnVVpV4gDcOLQUDgipQnBAiBs3OO6b8AR9BMbJZvu3BYQPVmx_M558M9_4gPkqQOayBJ-mKH1cFDzUPO5KoMFTo2Qa91Dn6wHXRvhiwKWBRRwCT-Ds9OjLr-evz06Pf8KW8kdfryMfKpMjP7-DTf4Ek76we9eB216OO_4G231uEm8w6MoctqIMghqitveWtj2XYO-fQ1vFCtTEq68k-oaDVBMHDwoPt27B_cmAtfXlztLyugdbSzsX9nOoJiegw97tSnW-BJWanRznTn54UzSv3sKaFjEKzWGI-6BVwGVgo-sV_2rH-ReZzi4sEBEuyEEMiSEmzk9pn04J40KXLYpQ2BtBjn7EqBUEmVd7NNWf45TLrWJMuzv3bgNfwwDBH30PREhu0eYDeYzSqHP0tjdbeF5Ho7TkE4vbuOdCuVKtzTr1RvPO1PjPTk-OoKMSoyd2F2ymhXeJXxe8Hlmep9Sm18cojbi-19N3F7ZGHwFj4sKzwUd9lVBdZIUQqKTLMkw7ElTfOWx8qKHAjzETloufi7OYA3Vz9iyDvz68hPbYggpwV-iYbC4EeYnIMY82hr3RJ5VJTIt9HvCZq-RlwA0eDYk2TWmSvuAi-TNfmY2N6OHqJrRXV5bam97i6kz2f16oiEeMEIZ8opWcQhtFzEmIWeoREowHGvMLUAY3aWj05tFyx9uwIlra-IOMxgrKtPQXGZ28gBVqAgM9-r4nYvoiLWHyv_rJueZaY3iJREgsrck0QYyrA65QMlUNWeqLUpv5x8ysra-ubI5TYlvjY1u-iaFZyUhIzA4QeJhynbcQCiDhIU0XEgJTByuxUIuAuUanWGLUK2Jul-zAWnSZ6WOMXWYbR4C7PI2M7SCHZEYNeEepuLDUKg37zN3lUUKrdBBwUzwNk11NgaBuq1Qa5pZbzUrmhbkHbI_WzfpcrdGq1eabTtNpVSrVEnvG3Mb8XKPpVKpVakx1p1FvHpbYfnZvea5RL9drjfK8UynXW80Sw0CQNjr5-5Q9U4e_ARz-Fnw)

## Alguns comandos necessitam de API

Edite o arquivo `config.js` que está dentro da pasta `src` e cole sua api key da plataforma Spider X API, conforme o código abaixo.
Para obter seu token, acesse: [https://api.spiderx.com.br](https://api.spiderx.com.br) e crie sua conta gratuitamente!

```js
export const SPIDER_API_TOKEN = "seu_token_aqui";
```

Para comandos de **canvas** e **gerar-link**, é necessário configurar a API do **Linker**:

```js
export const LINKER_BASE_URL = "https://linker.devgui.dev/api";
export const LINKER_API_KEY = "seu_token_aqui";
```

Obtenha sua API Key em: [https://linker.devgui.dev](https://linker.devgui.dev)

## Funcionalidades gerais

| Função | Contexto | Requer a Spider X API? |
| ------------ | --- | --- |
| Alterar imagem do bot | Dono | ❌ |
| Desligar o bot no grupo | Dono | ❌ |
| Executar comandos de infra | Dono | ❌ |
| Ligar o bot no grupo | Dono | ❌ |
| Modificar o prefixo por grupo | Dono | ❌ |
| Obter o ID do grupo | Dono | ❌ |
| Abrir grupo | Admin | ❌ |
| Advertir | Admin | ❌ |
| Agendar mensagem | Admin | ❌ |
| Anti audio | Admin | ❌ |
| Anti documento | Admin | ❌ |
| Anti evento | Admin | ❌ |
| Anti imagem | Admin | ❌ |
| Anti link | Admin | ❌ |
| Anti produto | Admin | ❌ |
| Anti sticker | Admin | ❌ |
| Anti video | Admin | ❌ |
| Banir membros | Admin | ❌ |
| Bloquear número no WhatsApp | Admin | ❌ |
| Excluir mensagens | Admin | ❌ |
| Fechar grupo | Admin | ❌ |
| Gestão de mensagens do auto-responder | Admin | ❌ |
| Ligar/desligar auto responder | Admin | ❌ |
| Ligar/desligar boas vindas | Admin | ❌ |
| Ligar/desligar saída de grupo | Admin | ❌ |
| Limpar chat | Admin | ❌ |
| Marcar todos | Admin | ❌ |
| Mudar nome do grupo | Admin | ❌ |
| Mute/unmute | Admin | ❌ |
| Obter o link do grupo | Admin | ❌ |
| Reativar advertência | Admin | ❌ |
| Remover advertência | Admin | ❌ |
| Revelar | Admin | ❌ |
| Somente admins | Admin | ❌ |
| Ver saldo | Admin | ❌ |
| Borrar imagem | Membro | ❌ |
| Brat (imagem com texto) | Membro | ✅ |
| Busca CEP | Membro | ❌ |
| Canvas Bolsonaro | Membro | ✅ |
| Canvas cadeia | Membro | ✅ |
| Canvas inverter | Membro | ✅ |
| Canvas RIP | Membro | ✅ |
| Comandos de diversão/brincadeiras | Membro |❌ |
| Espelhar imagem | Membro | ❌ |
| Facebook download | Membro | ✅ |
| Fake chat | Membro | ❌ |
| Figurinha animada para GIF | Membro | ✅ |
| Figurinha de texto animada | Membro | ✅ |
| Geração de imagens com IA | Membro | ✅ |
| Gerar link | Membro | ❌ |
| Google Gemini | Membro | ✅ |
| Google search | Membro | ✅ |
| GPT-5 Mini | Membro | ✅ |
| Imagem com contraste | Membro | ❌ |
| Imagem IA Flux | Membro | ✅ |
| Imagem pixelada | Membro | ❌ |
| Imagem preto/branco | Membro | ❌ |
| Informações de um comando | Membro | ❌ |
| Instagram download | Membro | ✅ |
| Pinterest download (carrossel) | Membro | ✅ |
| Ping | Membro | ❌ |
| Play áudio | Membro | ✅ |
| Play vídeo | Membro | ✅ |
| Renomear figurinha | Membro | ❌ |
| Sticker | Membro | ❌ |
| Sticker IA  | Membro | ✅ |
| Sticker para imagem | Membro | ❌ |
| TikTok video download | Membro | ✅ |
| YT MP3 | Membro | ✅ |
| YT MP4 | Membro | ✅ |
| YT search | Membro | ✅ |

## Funcionalidades de envio (Exemplos)

### 🎵 Exemplos de áudio

| Comando | Função | Descrição | Características |
|---------|---------|-----------|-----------------|
| `/enviar-audio-de-arquivo` | Enviar áudio de arquivo | Demonstra envio de arquivos de áudio do armazenamento local | Opção de mensagem de voz, resposta citada |
| `/enviar-audio-de-url` | Enviar áudio de URL | Demonstra envio de arquivos de áudio de URLs externas | Opção de mensagem de voz, resposta citada |
| `/enviar-audio-de-buffer` | Enviar áudio de buffer | Demonstra envio de arquivos de áudio de buffers de memória | Opção de mensagem de voz, resposta citada, buffer de arquivo ou URL |

### 🖼️ Exemplos de imagem

| Comando | Função | Descrição | Características |
|---------|---------|-----------|-----------------|
| `/enviar-imagem-de-arquivo` | Enviar imagem de arquivo | Demonstra envio de arquivos de imagem do armazenamento local | Suporte a legenda personalizada, menções, resposta citada |
| `/enviar-imagem-de-url` | Enviar imagem de URL | Demonstra envio de arquivos de imagem de URLs externas | Envio direto de URL, suporte a menções, resposta citada |
| `/enviar-imagem-de-buffer` | Enviar imagem de buffer | Demonstra envio de arquivos de imagem de buffers de memória | Buffer de arquivo ou URL, legenda opcional, menções, resposta citada |

### 🎬 Exemplos de vídeo

| Comando | Função | Descrição | Características |
|---------|---------|-----------|-----------------|
| `/enviar-video-de-arquivo` | Enviar vídeo de arquivo | Demonstra envio de arquivos de vídeo do armazenamento local | Suporte a legenda personalizada, menções, resposta citada |
| `/enviar-video-de-url` | Enviar vídeo de URL | Demonstra envio de arquivos de vídeo de URLs externas | Envio direto de URL, suporte a menções, resposta citada |
| `/enviar-video-de-buffer` | Enviar vídeo de buffer | Demonstra envio de arquivos de vídeo de buffers de memória | Buffer de arquivo ou URL, legenda opcional, menções, resposta citada |

### 🎞️ Exemplos de GIF

| Comando | Função | Descrição | Características |
|---------|---------|-----------|-----------------|
| `/enviar-gif-de-arquivo` | Enviar GIF de arquivo | Demonstra envio de arquivos GIF do armazenamento local | Suporte a legenda, menções, resposta citada |
| `/enviar-gif-de-url` | Enviar GIF de URL | Demonstra envio de arquivos GIF de URLs externas | Suporte a legenda, menções, resposta citada |
| `/enviar-gif-de-buffer` | Enviar GIF de buffer | Demonstra envio de arquivos GIF de buffers de memória | Buffer de arquivo ou URL, legenda, menções, resposta citada |

### 🎭 Exemplos de sticker

| Comando | Função | Descrição | Características |
|---------|--------|-----------|-----------------|
| `/enviar-sticker-de-arquivo` | Enviar sticker de arquivo | Demonstra envio de arquivos sticker do armazenamento local | Formato WebP |
| `/enviar-sticker-de-url` | Enviar sticker de URL | Demonstra envio de arquivos sticker de URLs externas | Formato WebP |
| `/enviar-sticker-de-buffer` | Enviar sticker de buffer | Demonstra envio de arquivos sticker de buffers de memória | Buffer de arquivo ou URL |

### 📊 Exemplos de enquete/votação

| Comando | Função | Descrição | Características |
|---------|--------|-----------|-----------------|
| `/enviar-enquete` | Enviar enquete | Demonstra como criar e enviar enquetes/votações em grupos | Suporte a escolha única ou múltipla escolha |

### 📍 Exemplos de localização

| Comando | Função | Descrição | Características |
|---------|---------|-----------|-----------------|
| `/enviar-localizacao` | Enviar localização | Demonstra como enviar localizações, com latitude e longitude | Suporte a latitude e longitude de qualquer lugar do mundo |

### 📲 Exemplos de contatos

| Comando | Função | Descrição | Características |
|---------|---------|-----------|-----------------|
| `/enviar-contato` | Enviar contato | Demonstra como enviar contatos | Os contatos podem ser chamados ou adicionados à lista dos seus contatos |

### 📄 Exemplos de documento

| Comando | Função | Descrição | Características |
|---------|---------|-----------|-----------------|
| `/enviar-documento-de-arquivo` | Enviar documento de arquivo | Demonstra envio de arquivos de documento do armazenamento local | Especificação de tipo MIME, nome de arquivo personalizado |
| `/enviar-documento-de-url` | Enviar documento de URL | Demonstra envio de arquivos de documento de URLs externas | Especificação de tipo MIME, nome de arquivo personalizado |
| `/enviar-documento-de-buffer` | Enviar documento de buffer | Demonstra envio de arquivos de documento de buffers de memória | Buffer de arquivo ou URL, tipo MIME, nome de arquivo personalizado |

### 💬 Exemplos de mensagem

| Comando | Função | Descrição | Características |
|---------|---------|-----------|-----------------|
| `/enviar-texto` | Enviar texto | Demonstra envio de mensagens de texto simples | Suporte a menções |
| `/enviar-resposta` | Enviar resposta | Demonstra envio de mensagens de resposta | Respostas de sucesso/erro/aviso |
| `/enviar-reacoes` | Enviar reações | Demonstra envio de emojis de reação | Várias reações emoji, reações de sucesso/erro/aviso |
| `/enviar-mensagem-editada` | Enviar mensagem editada | Demonstra envio de mensagens editadas | Pode editar mensagens enviadas de forma direta ou respondendo alguém |

### 📊 Exemplos de metadados

| Comando | Função | Descrição | Características |
|---------|---------|-----------|-----------------|
| `/obter-metadados-mensagem` | Obter metadados da mensagem | Demonstra extração avançada de metadados de mensagem ou mensagem citada | Análise detalhada, suporte a resposta de mensagens, informações técnicas, menções automáticas |
| `/obter-dados-grupo` | Obter dados do grupo | Demonstra extração de informações do grupo | Metadados do grupo, lista de participantes, informações de admin |
| `/funcoes-grupo` | Funções do grupo | Demonstra uso de funções utilitárias do grupo | Extração de nome, dono, admins, participantes do grupo |

### 🎯 Central de exemplos

| Comando | Função | Descrição | Características |
|---------|---------|-----------|-----------------|
| `/exemplos-de-mensagens` | Central de exemplos | Central com lista de todos os exemplos disponíveis | Menu interativo, acesso direto a todos os exemplos |

## Auto responder

O Venoy Bot possui um auto-responder embutido, edite o arquivo em `./database/auto-responder.json`:

```json
[
    {
        "match": "Oi",
        "answer": "Olá, tudo bem?"
    },
    {
        "match": "Tudo bem",
        "answer": "Estou bem, obrigado por perguntar"
    },
    {
        "match": "Qual seu nome",
        "answer": "Meu nome é Venoy Bot"
    }
]
```

## Auto figurinha / Auto sticker

O Venoy Bot possui um recurso de auto-figurinha que converte automaticamente imagens e vídeos enviados em figurinhas:

| Comando | Função | Descrição |
|---------|---------|-----------|
| `/auto-stick 1` | Ativar | Ativa a conversão automática no grupo |
| `/auto-stick 0` | Desativar | Desativa a conversão automática no grupo |

**Nota:** O recurso suporta imagens e vídeos de até 10 segundos.

## Onde fica o menu do bot?

O menu do bot fica dentro da pasta `src` no arquivo chamado `menu.js`

## Onde modifico a mensagem de boas vindas e quando alguém sai do grupo?

As mensagens ficam dentro da pasta `src` no arquivo chamado `messages.js`

## Diagrama de como os comandos funcionam

[![diagram](https://mermaid.ink/img/pako:eNqNVltrG0cU_isnCwGJqJJ2tZKtpTE4GwUMteVYlinFL6Pd0Xpb7Y48F9eJMeRCX_pSSqEPJRDSBAp9K6HQ9_0n_gPtT-iZ2YscW7KiBzGz831nznduuxdWwEJqeZagp4qmAX0ck4iT5DgF_BElWaqSCeX5fk64jIN4TlIJY0E5EAH_vf35A25U9o7H7DbsEZM56sOvcEi-o-Ik1s9uA_0kzIG_vIJtfqriMwYhA58lJA3RcM7YY5ICO8Or9f0NJHlI-e0FPB1v7z0ewtHQz36EXVxvw3gX_KFeDkv2_fvwsPrBeDTOXh7sDGGwd7Szfe0kB3MaSODRpOZ02g1wXP3X7dbzwyW-oCoP7H__-enq9fsqIEDTs5hAUKoouZrxxdaW4bQSmqplZs2pDiC6QicUCCBSkIgW6aFpuFzZo-Eh7B8M_cFodJeuQpIRV1_pgFNI0o7gw3gaBwQozDkLFCfAbotbrJBTqjwqqQKNQ8TVHIMjZPYOiMRcfwZnzuk0Pi9ZAeOcSga1Vn0pd_-mf3BsmUBbyxy9GXQltMjE-3LCW1tYky9B8KCFlrQp0WLfp5S3VhySMInTVYcJ1e3UWhOsqzc_wCANWCo5Ux4UJO1-81uxNlRnLMj-BEkTmFOexEJk79lniN6vwDAhgpKQQEqwR4UkeRyuXvwOuXJ4CCL7iP2ZmiadMFkBcvUIMAuhj02yK0AhBhGnisxw6nBQ6wq66GMYfD3wx4d31bQp564u7M7Kms7HRqeo68E5DZTUhUIWY2dtTRsT_glJTFN-mpZl1xr8sLqi4JSdLVWo6xvzzRahFhiOAzqfPYOamSIc0WLOMB31TzA7CY6EChPrXbJAEB4JqOG_wjslE9fULUAUEhIL6LYfwFSl2R_Z31Tk_hBxb5kwlFMG4avsY6QLb2HXqPNWRsFugk-weSNSOAsFxbjjNGFX34v5kPRcGqOlYWEQnSb2hp6qBftBDlztpqnuKlJPOEuexDNay-mNnF1fU4EHg9H-cHS49jVh6u-O0tOD3wP32kw1SU1DerPCciROkL8KuXmQVr1_8qFxZFq_el-UBXOvUmc1rIjHoeVJrmgDJyLHzOPWutCQY0ue0IQeWx4uQzolaib1wLxEGr6lv2EsKZk4mKITy5uSmcCdmodElh8P1VOOF1LuM5VKy3PaTs9YsbwL6xz3bq_Z6fW7tuM6G92O7XQb1jPLs-1e0-72-z27t9F3Hdu-bFjPzb120-1vbvZdt9tpu5sbbbRGw1gyvpt_wpgvmcv_AYwQ1RY?type=png)](https://mermaid.live/edit#pako:eNqNVltrG0cU_isnCwGJqJJ2tZKtpTE4GwUMteVYlinFL6Pd0Xpb7Y48F9eJMeRCX_pSSqEPJRDSBAp9K6HQ9_0n_gPtT-iZ2YscW7KiBzGz831nznduuxdWwEJqeZagp4qmAX0ck4iT5DgF_BElWaqSCeX5fk64jIN4TlIJY0E5EAH_vf35A25U9o7H7DbsEZM56sOvcEi-o-Ik1s9uA_0kzIG_vIJtfqriMwYhA58lJA3RcM7YY5ICO8Or9f0NJHlI-e0FPB1v7z0ewtHQz36EXVxvw3gX_KFeDkv2_fvwsPrBeDTOXh7sDGGwd7Szfe0kB3MaSODRpOZ02g1wXP3X7dbzwyW-oCoP7H__-enq9fsqIEDTs5hAUKoouZrxxdaW4bQSmqplZs2pDiC6QicUCCBSkIgW6aFpuFzZo-Eh7B8M_cFodJeuQpIRV1_pgFNI0o7gw3gaBwQozDkLFCfAbotbrJBTqjwqqQKNQ8TVHIMjZPYOiMRcfwZnzuk0Pi9ZAeOcSga1Vn0pd_-mf3BsmUBbyxy9GXQltMjE-3LCW1tYky9B8KCFlrQp0WLfp5S3VhySMInTVYcJ1e3UWhOsqzc_wCANWCo5Ux4UJO1-81uxNlRnLMj-BEkTmFOexEJk79lniN6vwDAhgpKQQEqwR4UkeRyuXvwOuXJ4CCL7iP2ZmiadMFkBcvUIMAuhj02yK0AhBhGnisxw6nBQ6wq66GMYfD3wx4d31bQp564u7M7Kms7HRqeo68E5DZTUhUIWY2dtTRsT_glJTFN-mpZl1xr8sLqi4JSdLVWo6xvzzRahFhiOAzqfPYOamSIc0WLOMB31TzA7CY6EChPrXbJAEB4JqOG_wjslE9fULUAUEhIL6LYfwFSl2R_Z31Tk_hBxb5kwlFMG4avsY6QLb2HXqPNWRsFugk-weSNSOAsFxbjjNGFX34v5kPRcGqOlYWEQnSb2hp6qBftBDlztpqnuKlJPOEuexDNay-mNnF1fU4EHg9H-cHS49jVh6u-O0tOD3wP32kw1SU1DerPCciROkL8KuXmQVr1_8qFxZFq_el-UBXOvUmc1rIjHoeVJrmgDJyLHzOPWutCQY0ue0IQeWx4uQzolaib1wLxEGr6lv2EsKZk4mKITy5uSmcCdmodElh8P1VOOF1LuM5VKy3PaTs9YsbwL6xz3bq_Z6fW7tuM6G92O7XQb1jPLs-1e0-72-z27t9F3Hdu-bFjPzb120-1vbvZdt9tpu5sbbbRGw1gyvpt_wpgvmcv_AYwQ1RY)

## Diagrama de como funcionam os middlewares (interceptadores) de recepção e saída

[![diagram](https://mermaid.ink/img/pako:eNqtld9qE0EUxl_lOFBoIW2TzV8WrU2tFKVJa9uAltycZE_TwexMnJ2NtaXghQqiIPXCC1FELIgXeq3XeZO-gD6Cs7NJtmmTBsG9CDsz5zvn7De_yRyxpvSIuSygRyGJJq1ybCn06wLMg6GWIvQbpOJxB5XmTd5BoaHs-VwABvDn08mPeHQ5aEXqOOT0HezgQwr2eTR3ObAWkOonO4Wq7EqokN9Qst5PWpWaQHZNkK2UiuJdE_3-KdyrlaurG1BeX6v1XlbgdnVnqwwbNdgu3wEzv7ZV29wYpJmZgRvD54IkWYhjFTU1qFZj1smmU-Dkop98fi5enNzT2YfnUG63wt43H0hohSAktFTYkYkyebPK-aUlY4prBsYOKRCW78reFwl4SWjCBsGrpE2DCGbbAM_Vk-G4OueEKxKD-S4XnrGbAt37DKh5Fz28eb2hFpdmm9JH4UkXFh9T2wzMN4q5cTmxrUeS9dMkARcKb1ILwScRYIt88AgaiXhUlDhrhdthI9Bch9y1HR4J09QxnL14C9aneNI6Fc9Wo6a9S-Yl7QzoOXkFdbZCvm1CwqjrcP_B7rU6m9RZstsWV9_iGkFDDRp-ZSKmdkAjbnkUjDXswrefPfv1--cbqEad7eEhiBEBCS8e2JerGI9Ow2TC-3BbzKcT_vH1kPAA-RinJ_C9Rb5JBssVVBzHyKbQbWpNY7tyjq4Ae989nII4HXB9Fd9jEv4z5manO-TxKRs9GXJr179Dbq0fUh57Hlk4FEWAT-a7L48AX7PRfbSF1HyPN7H31SB5ge8xbv1fzCdu_Dr3O6YYejI6WecsmzVtUdtigF2zL6E2mVNAujk3PDnAUqyluMdcrUJKMZ-Uj9GQHUUxdab3yac6c82rR3sYtnXk27GRmctrV0p_oDT_vq195u6hcSPFwo6HenCjDmeVqUjqlgyFZq6TLuVsFuYesQPmZorFhYKTzWSK6Wwpn8s4ZvUJc-cLhYVizsmWSvlC2kk72exxih3awpmFfM4pFLJ5s54pFfMpZljTUlXie91e78d_AUVrgqU?type=png)](https://mermaid.live/edit#pako:eNqtld9qE0EUxl_lOFBoIW2TzV8WrU2tFKVJa9uAltycZE_TwexMnJ2NtaXghQqiIPXCC1FELIgXeq3XeZO-gD6Cs7NJtmmTBsG9CDsz5zvn7De_yRyxpvSIuSygRyGJJq1ybCn06wLMg6GWIvQbpOJxB5XmTd5BoaHs-VwABvDn08mPeHQ5aEXqOOT0HezgQwr2eTR3ObAWkOonO4Wq7EqokN9Qst5PWpWaQHZNkK2UiuJdE_3-KdyrlaurG1BeX6v1XlbgdnVnqwwbNdgu3wEzv7ZV29wYpJmZgRvD54IkWYhjFTU1qFZj1smmU-Dkop98fi5enNzT2YfnUG63wt43H0hohSAktFTYkYkyebPK-aUlY4prBsYOKRCW78reFwl4SWjCBsGrpE2DCGbbAM_Vk-G4OueEKxKD-S4XnrGbAt37DKh5Fz28eb2hFpdmm9JH4UkXFh9T2wzMN4q5cTmxrUeS9dMkARcKb1ILwScRYIt88AgaiXhUlDhrhdthI9Bch9y1HR4J09QxnL14C9aneNI6Fc9Wo6a9S-Yl7QzoOXkFdbZCvm1CwqjrcP_B7rU6m9RZstsWV9_iGkFDDRp-ZSKmdkAjbnkUjDXswrefPfv1--cbqEad7eEhiBEBCS8e2JerGI9Ow2TC-3BbzKcT_vH1kPAA-RinJ_C9Rb5JBssVVBzHyKbQbWpNY7tyjq4Ae989nII4HXB9Fd9jEv4z5manO-TxKRs9GXJr179Dbq0fUh57Hlk4FEWAT-a7L48AX7PRfbSF1HyPN7H31SB5ge8xbv1fzCdu_Dr3O6YYejI6WecsmzVtUdtigF2zL6E2mVNAujk3PDnAUqyluMdcrUJKMZ-Uj9GQHUUxdab3yac6c82rR3sYtnXk27GRmctrV0p_oDT_vq195u6hcSPFwo6HenCjDmeVqUjqlgyFZq6TLuVsFuYesQPmZorFhYKTzWSK6Wwpn8s4ZvUJc-cLhYVizsmWSvlC2kk72exxih3awpmFfM4pFLJ5s54pFfMpZljTUlXie91e78d_AUVrgqU)

## Custom Middleware - Personalize o bot sem modificar arquivos principais

O arquivo `src/middlewares/customMiddleware.js` permite adicionar lógica personalizada sem mexer nos arquivos core do bot.

### Quando usar?

- ✅ Adicionar comportamentos personalizados
- ✅ Criar logs customizados
- ✅ Implementar lógica específica por grupo
- ✅ Reagir a eventos automáticos

### Exemplos práticos

#### Exemplo 1: Reagir automaticamente a mensagens

```javascript
export async function customMiddleware({ socket, webMessage, type, commonFunctions }) {
  if (type === "message" && commonFunctions) {
    const { userMessageText } = commonFunctions;
    if (userMessageText?.toLowerCase() === "oi") {
      await socket.sendMessage(webMessage.key.remoteJid, {
        react: { text: "👋", key: webMessage.key }
      });
    }
  }
}
```

#### Exemplo 2: Log quando alguém entra no grupo

```javascript
export async function customMiddleware({ webMessage, type, action }) {
  if (type === "participant" && action === "add") {
    console.log("Novo membro:", webMessage.messageStubParameters[0]);
  }
}
```

#### Exemplo 3: Mensagem personalizada em grupo específico

```javascript
export async function customMiddleware({ type, action, commonFunctions }) {
  const grupoVIP = "120363123456789012@g.us";
  
  if (type === "participant" && action === "add" && commonFunctions?.remoteJid === grupoVIP) {
    const { sendReply } = commonFunctions;
    await sendReply("🎉 Bem-vindo ao grupo VIP!");
  }
}
```

#### Exemplo 4: Usar funções avançadas do bot

```javascript
export async function customMiddleware({ type, commonFunctions }) {
  if (type === "message" && commonFunctions) {
    const {
      sendReply,
      sendSuccessReply,
      args,
      userMessageText,
      isImage,
      downloadImage,
    } = commonFunctions;
    
    // Sua lógica personalizada aqui
  }
}
```

### Parâmetros disponíveis

| Parâmetro | Tipo | Descrição |
|-----------|------|----------|
| `socket` | Object | Socket do Baileys para enviar mensagens |
| `webMessage` | Object | Mensagem completa do WhatsApp |
| `type` | String | "message" ou "participant" |
| `commonFunctions` | Object/null | Todas as funções do bot (null para eventos de participantes) |
| `action` | String | "add" ou "remove" (apenas em eventos de participantes) |
| `data` | String | Dados do participante (apenas em eventos de participantes) |

## Implementação técnica dos exemplos

### 📁 Localização dos comandos de exemplo

Todos os comandos de exemplo estão localizados em: `src/commands/member/exemplos/`

### 🛠️ Funções disponíveis

Todos os comandos de exemplo utilizam funções de `src/utils/loadCommonFunctions.js`:

#### Funções de áudio

- `sendAudioFromFile(filePath, asVoice, quoted)`
- `sendAudioFromURL(url, asVoice, quoted)`
- `sendAudioFromBuffer(buffer, asVoice, quoted)`

#### Funções de imagem

- `sendImageFromFile(filePath, caption, mentions, quoted)`
- `sendImageFromURL(url, caption, mentions, quoted)`
- `sendImageFromBuffer(buffer, caption, mentions, quoted)`

#### Funções de Vídeo

- `sendVideoFromFile(filePath, caption, mentions, quoted)`
- `sendVideoFromURL(url, caption, mentions, quoted)`
- `sendVideoFromBuffer(buffer, caption, mentions, quoted)`

#### Funções de GIF

- `sendGifFromFile(file, caption, mentions, quoted)`
- `sendGifFromURL(url, caption, mentions, quoted)`
- `sendGifFromBuffer(buffer, caption, mentions, quoted)`

#### Funções de sticker

- `sendStickerFromFile(filePath, quoted)`
- `sendStickerFromURL(url, quoted)`
- `sendStickerFromBuffer(buffer, quoted)`

#### Funções de documento

- `sendDocumentFromFile(filePath, mimetype, fileName, quoted)`
- `sendDocumentFromURL(url, mimetype, fileName, quoted)`
- `sendDocumentFromBuffer(buffer, mimetype, fileName, quoted)`

#### Funções de mensagem

- `sendText(text, mentions)`
- `sendReply(text, mentions)`
- `sendReact(emoji)`
- `sendSuccessReply(text, mentions)`, `sendErrorReply(text, mentions)`, `sendWarningReply(text, mentions)`, `sendWaitReply(text, mentions)`
- `sendSuccessReact()`, `sendErrorReact()`, `sendWarningReact()`, `sendWaitReact()`

#### Funções utilitárias de grupo

- `getGroupMetadata()` - Obter metadados completos do grupo
- `getGroupName()` - Obter apenas o nome do grupo
- `getGroupOwner()` - Obter informações do dono do grupo
- `getGroupParticipants()` - Obter todos os participantes do grupo
- `getGroupAdmins()` - Obter administradores do grupo

### 🎯 Exemplos de uso com menções

#### Enviar imagem com menções

```javascript
await sendImageFromFile("./assets/image.jpg", "Olá @5511999999999!", ["5511999999999@s.whatsapp.net"]);

await sendImageFromURL(
  "https://exemplo.com/imagem.png", 
  "Olá @5511999999999 e @5511888888888!", 
  ["5511999999999@s.whatsapp.net", "5511888888888@s.whatsapp.net"]
);
```

#### Enviar vídeo com menções

```javascript
await sendVideoFromFile("./assets/video.mp4", "Confira este vídeo @5511999999999!", ["5511999999999@s.whatsapp.net"]);

const buffer = fs.readFileSync("./video.mp4");
await sendVideoFromBuffer(
  buffer, 
  "Vídeo especial para @5511999999999 e @5511888888888!", 
  ["5511999999999@s.whatsapp.net", "5511888888888@s.whatsapp.net"]
);
```

#### Enviar GIF com menções

```javascript
await sendGifFromFile(
  "./assets/gif.mp4", 
  "Tá ai @5511999999999!", 
  ["5511999999999@s.whatsapp.net"]
);
```

### 🎯 Suporte TypeScript

Definições completas do TypeScript estão disponíveis em `src/@types/index.d.ts` com:

- Assinaturas de função detalhadas
- Descrições de parâmetros
- Exemplos de uso
- Especificações de tipo de retorno

### 📁 Arquivos de exemplo

Todos os arquivos de exemplo são armazenados em `assets/samples/`:

- `sample-audio.mp3` - Arquivo de áudio para teste
- `sample-document.pdf` - Documento PDF para teste
- `sample-document.txt` - Documento de texto para teste
- `sample-image.jpg` - Arquivo de imagem para teste
- `sample-sticker.webp` - Arquivo de sticker para teste
- `sample-video.mp4` - Arquivo de vídeo para teste

## Estrutura de pastas

- 📁 .github ➔ _workflows de CI/CD e arquivo para o agente do copilot_
- 📁 assets ➔ _arquivos de mídia_
  - 📁 auth ➔ _arquivos da conexão do bot_
  - 📁 images ➔ _arquivos de imagem_
    - 📁 funny ➔ _gifs de comandos de diversão_
  - 📁 samples ➔ _arquivos de exemplo para testes_
  - 📁 temp ➔ _arquivos temporários_
- 📁 database ➔ _arquivos de dados_
- 📁 diagrams ➔ _diagramas de fluxos de dados e execução do Bot_
- 📁 node_modules ➔ _módulos do Node.js_
- 📁 src ➔ _código fonte do bot (geralmente você mexerá mais aqui)_
  - 📁 @types ➔ _pasta onde fica as definições de tipos_
  - 📁 commands ➔ _pasta onde ficam os comandos_
    - 📁 admin ➔ _pasta onde ficam os comandos administrativos_
    - 📁 member ➔ _pasta onde ficam os comandos gerais (todos poderão utilizar)_
      - 📁 exemplos ➔ _pasta com 24 comandos de exemplo_
    - 📁 owner ➔ _pasta onde ficam os comandos de dono (grupo e bot)_
    - 📝🤖-como-criar-comandos.js ➔ _arquivo de exemplo de como criar um comando_
  - 📁 errors ➔ _classes de erros usadas nos comandos_
  - 📁 middlewares ➔ _interceptadores de requisições_
  - 📁 services ➔ _serviços diversos_
  - 📁 test ➔ _testes_
  - 📁 utils ➔ _utilitários_
  - 📝 config.js ➔ _arquivo de configurações do bot_
  - 📝 connection.js ➔ _script de conexão do bot com a biblioteca Baileys_
  - 📝 index.js ➔ _script ponto de entrada do bot_
  - 📝 loader.js ➔ _script de carga de funções_
  - 📝 menu.js ➔ _menu do bot_
  - 📝 messages.js ➔ _arquivos de mensagens de boas vindas e saída_
  - 📝 test.js ➔ _script de testes_
- 📝 .gitignore ➔ _arquivo para não subir certas pastas no GitHub_
- 📝 ⚡-cases-estao-aqui.js ➔ _easter egg_
- 📝 AGENTS.md ➔ _arquivo de instruções para IA's_
- 📝 CLAUDE.md ➔ _arquivo de instruções para a IA Claude_
- 📝 GEMINI.md ➔ _arquivo de instruções para a IA Gemini_
- 📝 CONTRIBUTING.md ➔ _guia de contribuição_
- 📝 LICENSE ➔ _arquivo de licença_
- 📝 package-lock.json ➔ _arquivo de cache das dependências do bot_
- 📝 package.json ➔ _arquivo de definição das dependências do bot_
- 📝 README.md ➔ _esta documentação_
- 📝 reset-qr-auth.sh ➔ _arquivo para excluir as credenciais do bot_
- 📝 update.sh ➔ _arquivo de atualização do bot_

## Atualizar o bot

Execute `bash update.sh`

## Testes

Execute `npm run test:all`

## Erros comuns

### 📁 Operação negada ao extrair a pasta

O erro abaixo acontece quando é feito o download do arquivo ZIP direto no celular em algumas versões do apk ZArchiver e também de celulares sem root.

Para resolver, siga o [tutorial de instalação via git clone](#instalação-no-termux).

![erro comum 1](./assets/images/erro-comum-1.jpg)

### 🔄 Remoção dos arquivos de sessão e conectar novamente

Caso dê algum erro na conexão, digite o seguinte comando:

```sh
bash reset-qr-auth.sh
```

Depois, remova o dispositivo do WhatsApp indo nas configurações do WhatsApp em "dispositivos conectados" e repita
o procedimento de iniciar o bot com `npm start`.

### ⏱️ Erro `rate-overlimit` após muito tempo offline

Quando o bot fica muito tempo desligado (por exemplo, horas ou um dia inteiro), ao religar ele pode tentar processar muitas mensagens acumuladas de uma vez.
Isso pode disparar erro de `rate-overlimit` durante a sincronização.

![erro comum 3](./assets/images/erro-comum-3.png)

Para corrigir, reinicie a autenticação do Baileys:

```sh
bash reset-qr-auth.sh
```

Em seguida, conecte o número novamente no WhatsApp em "dispositivos conectados".

### 🔐 Permission denied (permissão negada) ao acessar `cd /sdcard`

![erro comum 2](./assets/images/erro-comum-2.png)

Abra o termux, digite `termux-setup-storage` e depois, aceite as permissões

### ⚙️ Você configura o token da Spider API, prefixo, etc e o bot não reconhece

Verifique se você não tem dois Venoys rodando no seu celular, muitas pessoas baixam o zip e seguem o tutorial, porém, **o tutorial não explica pelo zip, e sim, pelo git clone**.

Geralmente as pessoas que cometem esse erro, ficam com dois bots:

1. O primeiro dentro da `/sdcard`
2. O segundo na pasta `/storage/emulated/0/Download`, que no zip fica como `venoy-bot-main`

Você deve apagar um dos bots e tanto configurar quanto executar **apenas um**

## Inscreva-se no canal

[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@devgui_?sub_confirmation=1)

## Contribuindo com o projeto

O Venoy Bot é um projeto **open source** e sua contribuição é muito bem-vinda!

### 🚀 Como contribuir

- 🐛 **Reportar bugs** através das [Issues](https://github.com/guiireal/venoy-bot/issues)
- ✨ **Sugerir novas funcionalidades**
- 🔧 **Contribuir com código** (novos comandos, correções, melhorias)
- ⭐ **Dar uma estrela** no repositório

### 📖 Antes de contribuir

1. Leia nosso **[Guia de Contribuição](CONTRIBUTING.md)** completo
2. Verifique as [Issues abertas](https://github.com/guiireal/venoy-bot/issues)
3. Siga o template obrigatório para Pull Requests

## Licença

[GPL-3.0](https://github.com/guiireal/venoy-bot/blob/main/LICENSE)

Este projeto está licenciado sob a Licença Pública Geral GNU (GPL-3.0).
Isso significa que:

- Você pode usar este código como quiser, seja para projetos pessoais ou comerciais.
- Você pode modificar o código para adaptá-lo às suas necessidades.
- Você pode compartilhar ou vender o código, mesmo modificado, mas precisa:
  - Manter os créditos ao autor original (Guilherme França - Dev Gui).
  - Tornar o código modificado disponível sob a mesma licença GPL-3.0.

O que você não pode fazer:

- Não pode transformar este código em algo proprietário (fechado) e impedir outras pessoas de acessá-lo ou usá-lo.

Esta licença garante que todos tenham acesso ao código-fonte e podem colaborar livremente, promovendo o compartilhamento e o aprimoramento do projeto.

## 📂 Arquitetura do Projeto

```text
venoyBot/
├── assets/             # Imagens, stickers, áudios, temporários e mídias
├── database/           # Persistência de dados local (JSON/Cache)
├── diagrams/           # Diagramas de arquitetura e fluxo de eventos
├── eggs/               # Templates e configurações para Pterodactyl Panel
├── src/                # Código-fonte principal
│   ├── commands/       # Módulos de comandos divididos por permissão
│   │   ├── admin/      # Comandos de moderação de grupos
│   │   ├── member/     # Comandos públicos (downloads, stickers, utilitários)
│   │   └── owner/      # Comandos restritos ao proprietário
│   ├── config.js       # Variáveis de configuração e personalização
│   └── index.js        # Inicialização do client Baileys v7
├── .gitignore          # Arquivos e diretórios ignorados
└── package.json        # Metadados e dependências
```

---

## ⚠ Observação sobre Dependências (Termux)

Neste repositório, o diretório `node_modules` foi disponibilizado para viabilizar a execução direta em dispositivos móveis via **Termux**, contornando limitações de compilação nativa que ocorrem em determinados ambientes Android.

---

## 📄 Licença

Este projeto está sob a licença [GPL-3.0](./LICENSE). Mantenha os créditos dos autores e compartilhe melhorias sob a mesma licença.

---

<div align="center">
  <sub>Desenvolvido com 💚 por <b>Paulo Venoy</b> & Comunidade Open Source</sub>
</div>
