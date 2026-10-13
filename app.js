
const stories = [
  ["You", "🌟"],
  ["Aarav", "😎"],
  ["Sara", "🌸"],
  ["Rahul", "🚀"],
  ["Aisha", "🎨"]
];

const starterPosts = [
  {
    name: "Win Face",
    caption: "Welcome to Win Face! ✨ Connect, Share and Grow.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900",
    likes: 12
  },
  {
    name: "Nature Lover",
    caption: "Find your peace in nature 🌿",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900",
    likes: 24
  }
];

let posts = [...starterPosts];
let xp = 0;

function showNotice(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    alert(message);
    return;
  }
  toast.textContent = message;
  toast.style.display = "block";
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 2200);
}

function showPage(page) {
  document.querySelectorAll("main section").forEach(section => {
    section.classList.add("hidden");
  });

  const target = document.getElementById("page-" + page);
  if (target) target.classList.remove("hidden");

  document.querySelectorAll(".nav").forEach(button => {
    button.classList.toggle(
      "active",
      button.getAttribute("onclick")?.includes("'" + page + "'")
    );
  });

  if (page === "create") {
    document.getElementById("caption")?.focus();
  }
}

function renderStories() {
  const container = document.getElementById("stories");
  if (!container) return;

  container.innerHTML = stories.map(([name, emoji]) => `
    <div class="story">
      <div class="big-avatar" style="margin:auto;width:52px;height:52px;font-size:23px">
        ${emoji}
      </div>
      <div>${name}</div>
    </div>
  `).join("");
}

function renderPosts(filter = "") {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const query = filter.toLowerCase();

  const filtered = posts.filter(post =>
    post.name.toLowerCase().includes(query) ||
    post.caption.toLowerCase().includes(query)
  );

  if (!filtered.length) {
    feed.innerHTML = '<div class="panel pad">No posts found 🔎</div>';
    return;
  }

  feed.innerHTML = filtered.map(post => {
    const index = posts.indexOf(post);

    return `
      <article class="post">
        <div class="post-head">🌈 ${post.name}</div>
        <img class="post-image"
          src="${post.image}"
          alt="Post photo"
          onerror="this.style.display='none'">
        <div class="post-body">
          <div class="post-actions">
            <button class="action" onclick="likePost(${index})">♡</button>
            <button class="action" onclick="commentPost(${index})">💬</button>
            <button class="action" onclick="sharePost(${index})">↗</button>
          </div>
          <p><strong>${post.likes} likes</strong></p>
          <p><strong>${post.name}</strong> ${escapeHTML(post.caption)}</p>
        </div>
      </article>
    `;
  }).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function likePost(index) {
  if (!posts[index]) return;
  posts[index].likes++;
  renderPosts(document.getElementById("search")?.value || "");
}

function commentPost(index) {
  const comment = prompt("Write your comment:");
  if (comment && comment.trim()) {
    showNotice("Comment added in this demo 💬");
  }
}

function sharePost(index) {
  const post = posts[index];
  if (!post) return;

  if (navigator.share) {
    navigator.share({
      title: "Win Face",
      text: post.caption
    }).catch(() => {});
  } else {
    showNotice("Win Face post ready to share! ↗");
  }
}

function publishPost() {
  const captionInput = document.getElementById("caption");
  const photoInput = document.getElementById("photo");
  const file = photoInput?.files?.[0];
  const caption = captionInput?.value.trim() || "";

  if (!caption && !file) {
    showNotice("Write something or choose a photo first!");
    return;
  }

  function addPost(image) {
    posts.unshift({
      name: "You",
      caption: caption || "My new post ✨",
      image: image || "",
      likes: 0
    });

    renderPosts(document.getElementById("search")?.value || "");
    captionInput.value = "";
    if (photoInput) photoInput.value = "";

    const preview = document.getElementById("preview");
    if (preview) {
      preview.src = "";
      preview.hidden = true;
    }

    updateProfile();
    showNotice("Your post was added! 🎉");
  }

  if (file) {
    if (!file.type.startsWith("image/")) {
      showNotice("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => addPost(reader.result);
    reader.onerror = () => showNotice("Could not read that image.");
    reader.readAsDataURL(file);
  } else {
    addPost("");
  }
}

function completeChallenge() {
  xp += 10;
  const xpLabel = document.getElementById("xp");
  if (xpLabel) xpLabel.textContent = "XP: " + xp;
  showNotice("+10 XP! Great work ⚡");
}

function updateProfile() {
  const count = document.getElementById("profile-count");
  if (count) count.textContent = posts.filter(p => p.name === "You").length + " posts";
}

document.getElementById("photo")?.addEventListener("change", event => {
  const file = event.target.files?.[0];
  const preview = document.getElementById("preview");

  if (file && preview) {
    if (!file.type.startsWith("image/")) {
      showNotice("Please select an image.");
      event.target.value = "";
      return;
    }

    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
  }
});

document.getElementById("search")?.addEventListener("input", event => {
  renderPosts(event.target.value);
});

window.showNotice = showNotice;
window.showPage = showPage;
window.publishPost = publishPost;
window.completeChallenge = completeChallenge;
window.likePost = likePost;
window.commentPost = commentPost;
window.sharePost = sharePost;

renderStories();
renderPosts();
updateProfile();
