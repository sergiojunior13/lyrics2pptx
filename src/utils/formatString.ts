export function formatString(text: string, textCase: "uppercase" | "capitalize" | "none" | string) {
  switch (textCase) {
    case "capitalize":
      text = text
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      break;
    case "uppercase":
      text = text.toUpperCase();
      break;
  }

  return text;
}
