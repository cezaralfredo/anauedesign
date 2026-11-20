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
  // 1. Inserir Card no topo do blog.html (compatível com layout V3 .blog-grid e legado .blog__grid)
  if (fs.existsSync(BLOG_HTML_PATH)) {
    let blogContent = fs.readFileSync(BLOG_HTML_PATH, 'utf-8');
    const markerV3 = '<div class="blog-grid">';
    const markerLegacy = '<div class=blog__grid>';

    if (blogContent.includes(markerV3)) {
      const lc = (category || '').toLowerCase();
      let filterGroup = 'estrategia';
      if (lc.includes('ia') || lc.includes('intelig') || lc.includes('automa')) filterGroup = 'ia';
      else if (lc.includes('seo') || lc.includes('geo')) filterGroup = 'seo';
      else if (lc.includes('cro') || lc.includes('convers') || lc.includes('marketing') || lc.includes('mídia') || lc.includes('e-commerce')) filterGroup = 'cro';
      else if (lc.includes('site') || lc.includes('pwa') || lc.includes('design') || lc.includes('hosped') || lc.includes('seguran') || lc.includes('moodle')) filterGroup = 'tech';

      const newCardV3 = `
          <a class="blog-card reveal" href="/blog/${slug}.html" data-category="${filterGroup}">
            <div class="blog-card__img">
              <img src="/assets/images/blog/${slug}.webp" alt="${title.replace(/"/g, '&quot;')}" width="600" height="338" loading="lazy">
            </div>
            <div class="blog-card__body">
              <span class="blog-card__cat">${category} · ${dateFormatted}</span>
              <h3>${title}</h3>
              <p>${description}</p>
              <span class="blog-card__more">Ler artigo completo →</span>
            </div>
          </a>`;
      blogContent = blogContent.replace(markerV3, `${markerV3}\n${newCardV3}`);
      fs.writeFileSync(BLOG_HTML_PATH, blogContent, 'utf-8');
      console.log(`[OK] Card V3 adicionado com sucesso em blog.html`);
    } else if (blogContent.includes(markerLegacy)) {
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
      blogContent = blogContent.replace(markerLegacy, `${markerLegacy}\n${newCardHtml}`);
      fs.writeFileSync(BLOG_HTML_PATH, blogContent, 'utf-8');
      console.log(`[OK] Card legado adicionado com sucesso em blog.html`);
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

  // 3. Adicionar URL ao llms.txt (Descoberta por motores de IA / GEO)
  const LLMS_PATH = path.join(ROOT_DIR, 'llms.txt');
  if (fs.existsSync(LLMS_PATH)) {
    let llmsContent = fs.readFileSync(LLMS_PATH, 'utf-8');
    const blogUrl = `https://anauedesign.com.br/blog/${slug}.html`;
    if (!llmsContent.includes(blogUrl)) {
      const newLlmsEntry = `- [${title}](${blogUrl}) — ${description}\n`;
      llmsContent = llmsContent.trimEnd() + '\n' + newLlmsEntry;
      fs.writeFileSync(LLMS_PATH, llmsContent, 'utf-8');
      console.log(`[OK] Artigo adicionado ao llms.txt para motores de IA`);
    }
  }
}

function commitAndPushPost({ slug, title }) {
  const { execSync } = require('child_process');
  try {
    console.log(`[GIT] Adicionando arquivos da matéria ${slug}...`);
    execSync('git add blog/ assets/images/blog/ blog.html sitemap.xml llms.txt .agents/', { cwd: ROOT_DIR, stdio: 'inherit' });
    
    const commitMsg = `feat(editorial): publicar materia ${slug}`;
    console.log(`[GIT] Executando commit: "${commitMsg}"...`);
    execSync(`git commit -m "${commitMsg}"`, { cwd: ROOT_DIR, stdio: 'inherit' });

    console.log(`[GIT] Executando git push origin main...`);
    execSync('git push origin main', { cwd: ROOT_DIR, stdio: 'inherit' });
    console.log(`[OK] Deploy e push concluídos com sucesso!`);
  } catch (err) {
    console.error(`[ERRO GIT] Falha durante commit/push:`, err.message);
  }
}

module.exports = { publishPostToBlog, commitAndPushPost };
