/**
 * Microfeed consumer for branislavdurina.github.io
 * Fetches posts from the headless microblog API and renders a responsive list + detail view.
 */
(function () {
  const CONFIG = {
    baseUrl: "https://feed.keeltruth.com",
    site: "homepage",
    listLimit: 6,
  };

  const listRoot = document.getElementById("microfeed");
  const articleRoot = document.getElementById("microfeed-article");
  if (!listRoot) return;

  const fmt = new Intl.DateTimeFormat("sk-SK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function renderTags(tags) {
    if (!tags?.length) return "";
    return `<div class="microfeed-tags">${tags
      .map((tag) => `<span class="microfeed-tag">${escapeHtml(tag)}</span>`)
      .join("")}</div>`;
  }

  function showStatus(message, isError) {
    listRoot.innerHTML = `<p class="microfeed-status${isError ? " microfeed-error" : ""}">${escapeHtml(message)}</p>`;
  }

  function hideArticle() {
    if (!articleRoot) return;
    articleRoot.hidden = true;
    articleRoot.innerHTML = "";
    listRoot.hidden = false;
  }

  function showArticle(post) {
    if (!articleRoot) return;
    const date = post.published_at ? fmt.format(new Date(post.published_at)) : "";
    listRoot.hidden = true;
    articleRoot.hidden = false;
    articleRoot.innerHTML = `
      <button type="button" class="microfeed-back" id="microfeed-back">← Späť na zoznam</button>
      <article class="microfeed-detail">
        <header>
          <time datetime="${escapeHtml(post.published_at || "")}">${escapeHtml(date)}</time>
          <h3>${escapeHtml(post.title)}</h3>
          ${renderTags(post.tags)}
        </header>
        <div class="microfeed-content">${post.body_html || ""}</div>
      </article>`;
    document.getElementById("microfeed-back")?.addEventListener("click", hideArticle);
    articleRoot.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function openPost(slug) {
    try {
      const res = await fetch(
        `${CONFIG.baseUrl}/api/v1/${CONFIG.site}/posts/${encodeURIComponent(slug)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      showArticle(data.post);
    } catch (err) {
      showStatus(`Príspevok sa nepodarilo načítať (${err.message}).`, true);
    }
  }

  async function loadPosts() {
    showStatus("Načítavam príspevky…");
    try {
      const res = await fetch(
        `${CONFIG.baseUrl}/api/v1/${CONFIG.site}/posts?limit=${CONFIG.listLimit}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.items?.length) {
        showStatus("Zatiaľ žiadne publikované príspevky.");
        return;
      }
      listRoot.innerHTML = data.items
        .map((post) => {
          const date = post.published_at ? fmt.format(new Date(post.published_at)) : "";
          return `
            <article class="microfeed-card">
              <time datetime="${escapeHtml(post.published_at || "")}">${escapeHtml(date)}</time>
              <h3><button type="button" class="microfeed-open" data-slug="${escapeHtml(post.slug)}">${escapeHtml(post.title)}</button></h3>
              <p>${escapeHtml(post.excerpt || "")}</p>
              ${renderTags(post.tags)}
            </article>`;
        })
        .join("");
      listRoot.querySelectorAll(".microfeed-open").forEach((btn) => {
        btn.addEventListener("click", () => openPost(btn.dataset.slug));
      });
    } catch (err) {
      showStatus(`Blog sa nepodarilo načítať (${err.message}).`, true);
    }
  }

  document.addEventListener("DOMContentLoaded", loadPosts);
})();
