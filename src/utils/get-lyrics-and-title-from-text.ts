export function getLyricsAndTitleFromText(text: string) {
  let content: string[] | string = text.trim();

  content = content.split("\n");

  const title = content[0].startsWith("-") ? content[0].slice(1) : null;

  if (title) {
    content.shift();
  }

  content = content.join("\n");

  return {
    lyrics: content,
    title,
  };
}
