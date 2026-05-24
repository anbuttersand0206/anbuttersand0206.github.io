# Portfolio

個人ポートフォリオサイトです。Next.js で構築し、GitHub Pages で静的公開しています。

## Tech Stack

- **Framework**: Next.js 15 (Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # 本番ビルド → out/
```

## Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── favicon.ico
│   └── apple-icon.png
├── components/
│   ├── navigation.tsx
│   ├── hero-section.tsx
│   ├── about-section.tsx
│   ├── skills-section.tsx
│   ├── projects-section.tsx
│   ├── works-section.tsx
│   ├── games-section.tsx
│   ├── contact-section.tsx
│   ├── footer.tsx
│   ├── particles-background.tsx
│   ├── games/               # ミニゲーム実装
│   └── ui/                  # shadcn/ui コンポーネント
└── public/
```

## Deploy to GitHub Pages

### 1. `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/your-repo-name',  // リポジトリ名に合わせて変更
  trailingSlash: true,
  images: { unoptimized: true },
}
export default nextConfig
```

> **Note**: `<username>.github.io` という名前のリポジトリに公開する場合は `basePath` は不要です。

### 2. GitHub Actions (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: latest
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 3. リポジトリ設定

Settings → Pages → Source を **GitHub Actions** に変更。
`main` ブランチへの push で自動デプロイされます。

## Customization

| セクション | ファイル |
|---|---|
| ヒーロー | `components/hero-section.tsx` |
| 自己紹介 | `components/about-section.tsx` |
| スキル | `components/skills-section.tsx` |
| 業務プロジェクト | `components/projects-section.tsx` |
| 個人開発 | `components/works-section.tsx` |
| ミニゲーム | `components/games-section.tsx`, `components/games/` |
| 連絡先 | `components/contact-section.tsx` |