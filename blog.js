const postsList = document.getElementById("postsList");
const postsCount = document.getElementById("postsCount");
const arabicDateFormatter = new Intl.DateTimeFormat("ar-SA", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function createStatus(title, message) {
  const status = document.createElement("div");
  status.className = "blog-status";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const description = document.createElement("p");
  description.textContent = message;

  status.append(heading, description);
  return status;
}

function renderMarkdown(markdown) {
  if (!window.marked || !window.DOMPurify) {
    const fallback = document.createElement("p");
    fallback.textContent = markdown;
    return fallback.outerHTML;
  }

  const renderedContent = window.marked.parse(markdown, {
    gfm: true,
    breaks: true,
  });

  return window.DOMPurify.sanitize(renderedContent, {
    USE_PROFILES: { html: true },
  });
}

function createPostCard(post, index) {
  const article = document.createElement("article");
  article.className = "post-card";

  const meta = document.createElement("div");
  meta.className = "post-card__meta";

  const number = document.createElement("span");
  number.className = "post-card__number";
  number.textContent = String(index + 1).padStart(2, "0");

  const publicationDate = new Date(post.date);
  const time = document.createElement("time");
  time.dateTime = post.date;
  time.textContent = arabicDateFormatter.format(publicationDate);
  meta.append(number, time);

  const body = document.createElement("div");
  body.className = "post-card__body";

  const title = document.createElement("h2");
  title.textContent = post.title;

  const content = document.createElement("div");
  content.className = "post-content";
  content.innerHTML = renderMarkdown(post.content);

  body.append(title, content);
  article.append(meta, body);
  return article;
}

async function loadPosts() {
  try {
    const response = await fetch("posts/index.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Unable to load posts: ${response.status}`);

    const posts = await response.json();
    if (!Array.isArray(posts)) throw new Error("Posts index has an invalid format");

    postsList.replaceChildren();
    postsList.setAttribute("aria-busy", "false");
    postsCount.textContent = posts.length ? `${posts.length} مقال` : "لا توجد مقالات بعد";

    if (posts.length === 0) {
      postsList.append(
        createStatus(
          "قريباً مقالات جديدة",
          "لم تُنشر مقالات بعد. أضف أول مقال من لوحة الإدارة وسيظهر هنا بعد اكتمال النشر.",
        ),
      );
      return;
    }

    posts.forEach((post, index) => postsList.append(createPostCard(post, index)));
  } catch (error) {
    console.error(error);
    postsList.replaceChildren(
      createStatus(
        "تعذّر تحميل المقالات",
        "يرجى تحديث الصفحة بعد قليل. إذا استمرت المشكلة، تحقق من اكتمال آخر عملية نشر.",
      ),
    );
    postsList.setAttribute("aria-busy", "false");
    postsCount.textContent = "";
  }
}

loadPosts();
