import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDirectory = path.join(projectRoot, "posts");
const outputFile = path.join(postsDirectory, "index.json");

function parseScalar(value) {
  const trimmedValue = value.trim();

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1).replace(/\\([\\"'])/g, "$1");
  }

  return trimmedValue;
}

function parsePost(source, filename) {
  const normalizedSource = source.replace(/\r\n/g, "\n");
  const match = normalizedSource.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Missing frontmatter in ${filename}`);
  }

  const metadata = {};

  for (const line of match[1].split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);
    metadata[key] = parseScalar(value);
  }

  if (!metadata.title || !metadata.date) {
    throw new Error(`Required title or date is missing in ${filename}`);
  }

  const timestamp = Date.parse(metadata.date);
  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid publication date in ${filename}`);
  }

  return {
    title: metadata.title,
    date: new Date(timestamp).toISOString(),
    content: match[2].trim(),
    slug: path.basename(filename, path.extname(filename)),
  };
}

const filenames = (await readdir(postsDirectory))
  .filter((filename) => filename.toLowerCase().endsWith(".md"))
  .sort();

const posts = await Promise.all(
  filenames.map(async (filename) => {
    const source = await readFile(path.join(postsDirectory, filename), "utf8");
    return parsePost(source, filename);
  }),
);

posts.sort((firstPost, secondPost) => Date.parse(secondPost.date) - Date.parse(firstPost.date));

await writeFile(outputFile, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
console.log(`Generated ${posts.length} blog post${posts.length === 1 ? "" : "s"}.`);
