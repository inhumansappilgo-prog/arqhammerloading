# ABERTURA CINEMÁTICA — PROTOCOLO AXIAL

Abertura interativa e otimizada para GitHub Pages e incorporação em tela cheia no Tumblr.

## Arquivos

```text
index.html
axial-boot.css
axial-boot.js
.nojekyll
TUMBLR-EMBED.html
README.md
```

## Publicar

1. Crie um repositório público chamado `arqhammerboot`.
2. Use **Add file → Upload files** e envie todos os arquivos deste pacote.
3. Confirme em **Commit changes**.
4. Abra **Settings → Pages**.
5. Selecione **Deploy from a branch**, **main** e **/(root)**.
6. Aguarde a publicação em:

```text
https://inhumansappilgo-prog.github.io/arqhammerboot/
```

## Tumblr

Abra `TUMBLR-EMBED.html`, copie todo o código e cole em uma Página de **Layout Personalizado** do Tumblr.

O botão **ACESSO CONCEDIDO** abre `https://arquivoshammer.tumblr.com/inicio` fora do iframe. O visitante pode ignorar a abertura pelo botão superior ou pela tecla `Esc`. Quando a liberação estiver pronta, `Enter` também inicia o protocolo.

## Comportamento de carregamento

- A primeira visita executa a sequência cinematográfica completa.
- Visitas seguintes na mesma sessão usam uma inicialização curta.
- A barra combina duração cinematográfica mínima com o evento real de carregamento do navegador.
- Existe um limite de segurança para evitar que a tela permaneça bloqueada.
- Usuários com redução de movimento recebem uma transição imediata.
- Nenhuma imagem, fonte ou biblioteca externa é necessária para renderizar a abertura.

Se usar outro nome de repositório, altere apenas o endereço `src` dentro de `TUMBLR-EMBED.html`.
