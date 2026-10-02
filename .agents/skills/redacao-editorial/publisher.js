/**
 * Anauê Design - Editorial Publisher Helper
 * Utilitário para registrar novos posts no blog.html e no sitemap.xml
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const BLOG_HTML_PATH = path.join(ROOT_DIR, 'blog.html');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');

function publishPostToBlog({ slug, title, description, category, dateFormatted, dateIso }) {
  // 1. Inserir Card no topo do blog.html
  if (fs.existsSync(BLOG_HTML_PATH)) {
    let blogContent = fs.readFileSync(BLOG_HTML_PATH, 'utf-8');
    const marker = '<div class=blog__grid>';
    
    const newCardHtml = `
<article class=blog__card>
<div class=blog__card-body>
<div class=blog__card-meta>
<span class=blog__card-tag><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> <span>${category}</span></span>
<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> <span>${dateFormatted}</span></span>
</div>
<h2 class=blog__card-title><a href=/blog/${slug}.html>${title}</a></h2>
<p class=blog__card-desc>${description}</p>
<a class=blog__card-link href=/blog/${slug}.html>Ler matéria completa <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
</div>
</article>`;

    if (blogContent.includes(marker)) {
      blogContent = blogContent.replace(marker, `${marker}\n${newCardHtml}`);
      fs.writeFileSync(BLOG_HTML_PATH, blogContent, 'utf-8');
      console.log(`[OK] Card adicionado com sucesso em blog.html`);
    }
  }

  // 2. Adicionar URL ao sitemap.xml
  if (fs.existsSync(SITEMAP_PATH)) {
    let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf-8');
    const sitemapClose = '</urlset>';
    const newEntry = `  <url>
    <loc>https://anauedesign.com.br/blog/${slug}.html</loc>
    <lastmod>${dateIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;

    if (sitemap.includes(sitemapClose) && !sitemap.includes(`/blog/${slug}.html`)) {
      sitemap = sitemap.replace(sitemapClose, `${newEntry}${sitemapClose}`);
      fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf-8');
      console.log(`[OK] URL adicionada ao sitemap.xml`);
    }
  }
}

module.exports = { publishPostToBlog };
