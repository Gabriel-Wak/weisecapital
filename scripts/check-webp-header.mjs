import https from "https";
import fs from "fs";

const url = process.argv[2];
if (!url) {
  console.error("Usage: node check-webp-header.mjs <url-or-path>");
  process.exit(1);
}

function inspect(buf, label) {
  const hex = buf.slice(0, 24).toString("hex");
  const riff = buf.slice(0, 4).toString();
  const fourcc = buf.slice(8, 12).toString();
  const chunk = buf.slice(12, 16).toString();
  let replacements = 0;
  for (let i = 0; i < buf.length - 2; i++) {
    if (buf[i] === 0xef && buf[i + 1] === 0xbf && buf[i + 2] === 0xbd) {
      replacements++;
      i += 2;
    }
  }
  const ok = riff === "RIFF" && fourcc === "WEBP";
  console.log({
    label,
    len: buf.length,
    hex,
    riff,
    fourcc,
    chunk,
    utf8ReplacementCount: replacements,
    validWebpHeader: ok,
  });
}

if (url.startsWith("http")) {
  https.get(url, (res) => {
    const chunks = [];
    res.on("data", (c) => chunks.push(c));
    res.on("end", () => inspect(Buffer.concat(chunks), url));
  });
} else {
  inspect(fs.readFileSync(url), url);
}
