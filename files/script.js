async function loadStarredRepos() {
  const status = document.getElementById("status");
  const list = document.getElementById("repo-list");

  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Failed to load events.json (status ${response.status})`);
    }

    const repos = await response.json();
    renderRepos(repos, list);
    status.textContent = `${repos.length} starred repositories`;
  } catch (err) {
    status.textContent = "Could not load starred repositories.";
    status.classList.add("error");
    console.error(err);
  }
}

function renderRepos(repos, list) {
  list.innerHTML = "";

  const sorted = [...repos].sort(
    (a, b) => new Date(b.starredAt) - new Date(a.starredAt)
  );

  for (const repo of sorted) {
    const item = document.createElement("li");
    item.className = "repo-card";

    const link = document.createElement("a");
    link.className = "repo-name";
    link.href = repo.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = repo.name;

    const description = document.createElement("p");
    description.className = "repo-description";
    description.textContent = repo.description || "No description provided.";

    const meta = document.createElement("div");
    meta.className = "repo-meta";

    const stars = document.createElement("span");
    stars.className = "stars";
    stars.textContent = `\u2605 ${formatStars(repo.stars)}`;

    const language = document.createElement("span");
    if (repo.language) {
      language.innerHTML = `<span class="dot"></span>${repo.language}`;
    }

    meta.appendChild(stars);
    if (repo.language) {
      meta.appendChild(language);
    }

    item.appendChild(link);
    item.appendChild(description);
    item.appendChild(meta);
    list.appendChild(item);
  }
}

function formatStars(count) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}

document.addEventListener("DOMContentLoaded", loadStarredRepos);
