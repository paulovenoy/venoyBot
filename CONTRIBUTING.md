# Contribuindo com o Venoy Bot

Obrigado por querer ajudar! Para manter o projeto organizado, siga este guia rápido.

## Como começar

1. **Fork & Clone**: Crie seu fork e clone localmente.
2. **Branch**: Use nomes claros (`feature/nome` ou `fix/nome`).
3. **Ambiente**: Utilize **Node.js v22**.
4. **Template**: Baseie novos comandos no arquivo `🤖-como-criar-comandos.js`.

## Estrutura de Comandos

Adicione seu arquivo na pasta correta em `src/commands/`:

* `owner/`: Apenas o dono.
* `admin/`: Apenas administradores.
* `member/`: Público geral.

## Padrões de Código

* **Não reinvente a roda**: Use as funções em `src/utils`.
* **Tipagem**: Sempre importe e use `CommandHandleProps` no JSDoc.
* **Limpeza**: Se gerar arquivos temporários, certifique-se de excluí-los.
* **Delay**: Use `randomDelay()` para evitar banimentos.

## Enviando seu PR

Ao abrir o Pull Request, preencha o template básico:

1. **O que mudou?** (Breve descrição).
2. **Tipo**: Bugfix, Feature ou Refactor.
3. **Prints**: Anexe prints do comando funcionando (sucesso e erro).

---
