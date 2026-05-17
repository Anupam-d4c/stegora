const ZERO_WIDTH_SPACE = "\u200B";
const ZERO_WIDTH_NON_JOINER = "\u200C";
const ZERO_WIDTH_JOINER = "\u200D";

function textToBinary(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";

  for (const byte of bytes) {
    binary += byte.toString(2).padStart(8, "0") + " ";
  }

  return binary.trim();
}

function binaryToText(binary) {
  const chunks = binary.trim().split(/\s+/);
  const bytes = [];

  for (const chunk of chunks) {
    if (!/^[01]{8}$/.test(chunk)) continue;
    bytes.push(parseInt(chunk, 2));
  }

  return new TextDecoder().decode(new Uint8Array(bytes));
}

export function encodeUnicodeMessage(message, carrier = "🎁") {
  const binary = textToBinary(message);

  const hidden = binary
    .replace(/0/g, ZERO_WIDTH_SPACE)
    .replace(/1/g, ZERO_WIDTH_NON_JOINER)
    .replace(/ /g, ZERO_WIDTH_JOINER);

  return carrier + hidden;
}

export function decodeUnicodeMessage(text) {
  const hidden = [...text]
    .filter((ch) =>
      ch === ZERO_WIDTH_SPACE ||
      ch === ZERO_WIDTH_NON_JOINER ||
      ch === ZERO_WIDTH_JOINER
    )
    .join("");

  if (!hidden) {
    throw new Error("No hidden Unicode payload found.");
  }

  const binary = hidden
    .replaceAll(ZERO_WIDTH_SPACE, "0")
    .replaceAll(ZERO_WIDTH_NON_JOINER, "1")
    .replaceAll(ZERO_WIDTH_JOINER, " ");

  return binaryToText(binary);
}