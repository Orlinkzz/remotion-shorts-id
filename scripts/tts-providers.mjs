// Provider TTS untuk scripts/tts.mjs. Setiap provider: synth(text, opts) -> Buffer audio (mp3).
// opts = { voice, locale, rate } dari tts-config.mjs; rate dalam persen relatif.
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const escapeXml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const ratePercent = (rate) => `${rate >= 0 ? "+" : ""}${rate}%`;

const readAll = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (c) => chunks.push(c));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });

const ensureAudio = (buf, name) => {
  if (!buf || buf.length < 1000) {
    throw new Error(`${name}: audio kosong (${buf?.length ?? 0} byte)`);
  }
  return buf;
};

const httpError = async (name, res) => {
  const body = (await res.text()).slice(0, 200);
  return new Error(`${name}: HTTP ${res.status} ${body}`);
};

let edgeClient = null;

const edge = {
  name: "edge",
  available: () => true,
  async synth(text, { voice, locale, rate }) {
    if (!edgeClient) {
      edgeClient = new MsEdgeTTS({ synthesisTimeoutMs: 30000 });
      await edgeClient.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, {
        voiceLocale: locale,
      });
    }
    const { audioStream } = edgeClient.toStream(escapeXml(text), {
      rate: ratePercent(rate),
    });
    return ensureAudio(await readAll(audioStream), "edge");
  },
  close() {
    edgeClient?.close();
    edgeClient = null;
  },
};

const azure = {
  name: "azure",
  available: () =>
    Boolean(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION),
  missing: "AZURE_SPEECH_KEY / AZURE_SPEECH_REGION belum diisi di .env",
  async synth(text, { voice, locale, rate }) {
    const ssml =
      `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}">` +
      `<voice name="${voice}"><prosody rate="${ratePercent(rate)}">${escapeXml(text)}</prosody></voice></speak>`;
    const res = await fetch(
      `https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
          "User-Agent": "remotion-shorts-id",
        },
        body: ssml,
      },
    );
    if (!res.ok) throw await httpError("azure", res);
    return ensureAudio(Buffer.from(await res.arrayBuffer()), "azure");
  },
};

const google = {
  name: "google",
  available: () => Boolean(process.env.GOOGLE_TTS_API_KEY),
  missing: "GOOGLE_TTS_API_KEY belum diisi di .env",
  async synth(text, { voice, locale, rate }) {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(process.env.GOOGLE_TTS_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: locale, name: voice },
          audioConfig: { audioEncoding: "MP3", speakingRate: 1 + rate / 100 },
        }),
      },
    );
    if (!res.ok) throw await httpError("google", res);
    const { audioContent } = await res.json();
    return ensureAudio(Buffer.from(audioContent ?? "", "base64"), "google");
  },
};

// Google Translate membatasi ±200 karakter per permintaan: potong di batas kata.
const chunkText = (text, max = 180) => {
  const chunks = [];
  let cur = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (cur && (cur + " " + word).length > max) {
      chunks.push(cur);
      cur = word;
    } else {
      cur = cur ? `${cur} ${word}` : word;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
};

const gtranslate = {
  name: "gtranslate",
  available: () => true,
  async synth(text, { locale }) {
    const parts = [];
    for (const chunk of chunkText(text)) {
      const url =
        "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob" +
        `&tl=${encodeURIComponent(locale)}&q=${encodeURIComponent(chunk)}`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw await httpError("gtranslate", res);
      parts.push(Buffer.from(await res.arrayBuffer()));
    }
    // Frame MP3 boleh disambung; hasilnya dinormalisasi ffmpeg setelah ini.
    return ensureAudio(Buffer.concat(parts), "gtranslate");
  },
};

export const providers = { edge, azure, google, gtranslate };
