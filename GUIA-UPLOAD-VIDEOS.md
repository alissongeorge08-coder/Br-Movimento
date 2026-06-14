# Guia de Upload de Vídeos — Brasil em Movimento
**Cloudflare R2 + GitHub Pages**

---

## Visão geral

Os vídeos do app ficam no **Cloudflare R2** (armazenamento em nuvem gratuito até 10 GB/mês de saída). O app no GitHub Pages busca os vídeos diretamente da URL pública do R2. Você faz o upload uma vez; eu atualizo a URL no código.

---

## Passo 1 — Criar a conta no Cloudflare

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) e crie uma conta gratuita (ou entre se já tiver).
2. No painel lateral esquerdo, clique em **R2 Object Storage**.
3. Clique em **Create bucket**.
4. Dê um nome ao bucket, por exemplo: `brasil-em-movimento-videos`
5. Região: selecione **Automática** (o Cloudflare escolhe a mais próxima).
6. Clique em **Create bucket**.

---

## Passo 2 — Ativar a URL pública do bucket

Sem isso os vídeos ficam inacessíveis publicamente.

1. Dentro do bucket, clique na aba **Settings**.
2. Role até a seção **Public access**.
3. Clique em **Allow Access** → confirme.
4. Copie a **Public Bucket URL** — ela tem o formato:
   ```
   https://pub-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev
   ```
   **Guarde essa URL — você vai me mandar ela depois.**

---

## Passo 3 — Estrutura de pastas dos vídeos

Os vídeos precisam estar organizados assim dentro do bucket:

```
720p/
  marcacao-basica-basico.mp4
  marcacao-basica-intermediario.mp4
  marcacao-basica-avancado.mp4
  caminhada-deslocamento-basico.mp4
  ...
480p/
  marcacao-basica-basico.mp4
  ...
1080p/
  marcacao-basica-basico.mp4
  ...
```

> **Atenção:** Os nomes dos arquivos precisam bater exatamente com os mapeados no código (`main.js`). Se os seus arquivos de vídeo tiverem outros nomes, me avise e eu atualizo o mapeamento.

### Nomenclatura atual esperada pelo app

O app monta o caminho assim: `{qualidade}/{nomeDoArquivo}`

Exemplo: `https://pub-xxx.r2.dev/720p/marcacao-basica-basico.mp4`

---

## Passo 4 — Fazer o upload dos vídeos

### Opção A — Via painel web (mais fácil, para poucos arquivos)

1. Dentro do bucket no painel Cloudflare, clique em **Upload**.
2. Crie as pastas `720p/`, `480p/` e `1080p/` manualmente arrastando arquivos com o caminho correto, ou clicando em **New folder** antes de fazer upload.
3. Suba os arquivos `.mp4` dentro de cada pasta de qualidade.

### Opção B — Via Wrangler CLI (recomendado para muitos arquivos)

```bash
# Instala o Wrangler (CLI da Cloudflare) uma única vez
npm install -g wrangler

# Faz login
wrangler login

# Sobe uma pasta inteira para o bucket
wrangler r2 object put brasil-em-movimento-videos/720p/marcacao-basica-basico.mp4 \
  --file ./videos/720p/marcacao-basica-basico.mp4

# Para subir tudo de uma vez (Windows PowerShell):
Get-ChildItem -Recurse -File .\videos\ | ForEach-Object {
    $key = $_.FullName.Replace((Resolve-Path .\videos\).Path + "\", "").Replace("\", "/")
    wrangler r2 object put "brasil-em-movimento-videos/$key" --file $_.FullName
}
```

---

## Passo 5 — O que me mandar depois do upload

Quando terminar, me mande:

1. **A URL pública do bucket** (formato `https://pub-xxx.r2.dev`)
2. **A lista dos nomes exatos dos arquivos** que você subiu (ou um print da pasta no painel)

Com isso, eu:
- Substituo o placeholder `https://SEU_BUCKET.r2.dev` no `main.js`
- Confirmo que os nomes batem com o mapeamento do currículo
- Faço o commit para o GitHub Pages

---

## Passo 6 — Configurar CORS no bucket (necessário para o app funcionar)

O browser bloqueia requisições de domínios diferentes por padrão. Você precisa liberar o GitHub Pages para acessar o R2.

1. No painel do bucket, vá em **Settings → CORS Policy**.
2. Clique em **Add CORS policy** e cole o JSON abaixo:

```json
[
  {
    "AllowedOrigins": [
      "https://SEU_USUARIO.github.io",
      "http://localhost:5500",
      "http://127.0.0.1:5500"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

> Substitua `SEU_USUARIO` pelo seu usuário do GitHub.

---

## Resumo do fluxo

```
Você grava os vídeos
        ↓
Sobe no Cloudflare R2 (pastas 720p/, 480p/, 1080p/)
        ↓
Me manda a URL pública + lista de arquivos
        ↓
Eu atualizo o main.js e faço commit no GitHub
        ↓
App funcionando com vídeos reais ✅
```

---

## Custos

| Item | Gratuito |
|------|----------|
| Armazenamento | Até 10 GB |
| Saída de dados (downloads) | Até 10 GB/mês |
| Operações de leitura (GET) | Até 10 milhões/mês |

Para um projeto acadêmico com uso moderado, **fica dentro do plano gratuito sem precisar de cartão de crédito**.

---

*Qualquer dúvida no processo, me chame que resolvo junto.*
