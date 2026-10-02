---
name: redacao-editorial-anaue
description: "Pipeline jornalística e editorial autônoma da Anauê Design para pesquisa de tendências, apuração com fontes aprofundadas, redação técnica E-E-A-T, geração de capas editoriais e publicação de artigos no blog da Anauê."
---

# Redação Editorial Autônoma · Anauê Design

Este skill executa o fluxo completo de uma redação digital profissional para o portal da Anauê Design (`anauedesign.com.br`).

## 1. Escopo Temático da Anauê Design
Os artigos devem sempre focar nas 6 especialidades de negócio da agência:
1. **Inteligência Artificial & Automação de Negócios:** Agentes autônomos, integrações de WhatsApp, LLMs para empresas, automação de processos.
2. **SEO & GEO (Generative Engine Optimization):** Posicionamento orgânico no Google e citação em IAs (ChatGPT, Perplexity, Gemini, Claude).
3. **Criação de Sites & Progressive Web Apps (PWA):** Performance web, Core Web Vitals, experiência do usuário (UX/UI), conversão.
4. **Marketing Digital & Performance:** Inbound & Outbound Marketing, gestão de tráfego (Google Ads e Meta Ads), funis de aquisição de clientes.
5. **Hospedagem Gerenciada & Infraestrutura Webmaster:** Segurança cibernética, servidores dedicados, monitoramento, backup gerenciado.
6. **Customização Moodle & EAD Corporativo:** Ambientes virtuais de aprendizagem, engajamento e retenção de alunos.

---

## 2. Fontes Enriquecidas de Pesquisa & Apuração (Deep Research)
Antes de escrever qualquer linha, o agente DEVE pesquisar e apurar dados factuais, benchmarks e citações reais utilizando:
* **Mecanismos Globais de Pesquisa Técnica:**
  - Google Search Central Blog, Search Engine Journal, Search Engine Land, Moz, Ahrefs Blog.
  - OpenAI Research, Google AI Blog, DeepMind Research, Anthropic News.
  - Web.dev, MDN Web Docs, Smashing Magazine.
  - Hubspot Research, Neil Patel Blog, Rock Content, Gartner & McKinsey Tech Trends.
* **Critérios de Validação Jornalística:**
  - Pelo menos 2 dados estatísticos verídicos ou benchmarks de mercado do ano corrente.
  - 1 exemplo prático de aplicação no mundo real.
  - Nenhuma alucinação ou suposição sem fundamentação.

---

## 3. Estrutura Padrão do Artigo (Padrão E-E-A-T e Schema.org)
Todo artigo gerado deve conter:
1. **Título Jornalístico Forte:** Chamativo, informativo e focado na intenção de busca.
2. **Lead / Gancho Editorial:** Os primeiros dois parágrafos devem contextualizar o problema com urgência e relevância de mercado.
3. **Corpo do Texto (1.200 a 2.000 palavras):**
   - Intertítulos H2 e H3 bem estruturados.
   - Boxes de destaque com dicas práticas (`> [!TIP]`, `> [!NOTE]`).
   - Tabela comparativa ou resumo visual quando aplicável.
4. **Internal Linking Estratégico:** Citar de forma natural e linkar para as páginas de serviços da Anauê:
   - `/criacao-de-sites.html`
   - `/marketing-digital.html`
   - `/seo.html`
   - `/inteligencia-artificial.html`
   - `/customizacao-moodle.html`
   - `/hospedagem.html`
5. **FAQ Estruturado:** Mínimo de 3 perguntas e respostas frequentes no final.
6. **Chamada para Ação (CTA):** Botão direto para o WhatsApp da Anauê (`https://wa.me/5585996277707?text=Olá!%20Li%20o%20artigo%20no%20blog%20e%20gostaria%20de%20conversar`).

---

## 4. Direção de Arte e Imagem de Capa
* Criar uma capa proporcional 16:9 através da ferramenta `generate_image`.
* Estilo visual: Minimalista, editorial moderno, cores da Anauê (azul profundo `#0a1128`, ciano elétrico `#00e5ff`, roxo neon ou toques dourados), sem pessoas caricatas ou clichês de IA de baixa qualidade.
* Salvar a imagem otimizada em `assets/images/blog/<slug-do-artigo>.webp`.

---

## 5. Publicação Técnica
1. Criar o arquivo HTML individual em `blog/<slug-do-artigo>.html` seguindo o template responsivo da Anauê.
2. Inserir Schema `NewsArticle` ou `BlogPosting` completo com autor, data, publisher e imagem.
3. Atualizar o grid de artigos no `blog.html` adicionando o novo card no topo.
4. Adicionar a nova URL no `sitemap.xml` com `<lastmod>` atualizado.
