// Graba el tráiler: node export.js fotos 1 2.5 8   → cuadros sueltos en revision/
//                   node export.js video          → crisol-trailer.mp4 (1080 × 1350, 30 fps, H.264, con la música de audio.js)
const puppeteer = require("puppeteer-core");
const { spawn } = require("child_process");
const fs = require("fs"), path = require("path");
const FPS = 30;
(async () => {
  const modo = process.argv[2] || "fotos";
  const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--hide-scrollbars", "--force-color-profile=srgb"], defaultViewport: { width: 1080, height: 1350, deviceScaleFactor: 1 } });
  const p = await b.newPage();
  const errores = []; p.on("pageerror", e => errores.push(e.message)); p.on("console", m => { if (m.type() === "error") errores.push(m.text()); });
  await p.goto("file://" + path.join(__dirname, "index.html") + "?render");
  await p.waitForFunction("window.LISTO === true", { timeout: 20000 });
  const DUR = await p.evaluate(() => window.DUR);
  const clip = { x: 0, y: 0, width: 1080, height: 1350 };
  if (modo === "fotos") {
    const dir = path.join(__dirname, "revision"); fs.mkdirSync(dir, { recursive: true });
    for (const s of process.argv.slice(3).map(Number)) { await p.evaluate(t => window.seek(t), s); await p.screenshot({ path: path.join(dir, "t" + s.toFixed(2) + ".png"), clip }); }
  } else {
    const n = Math.round(DUR * FPS);
    const salida = path.join(__dirname, "crisol-trailer-mudo.mp4");
    const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart", salida], { stdio: ["pipe", "inherit", "inherit"] });
    for (let i = 0; i < n; i++) {
      await p.evaluate(t => window.seek(t), i / FPS);
      const buf = await p.screenshot({ clip, type: "png" });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
      if (i % 150 === 0) console.log("cuadro " + i + " de " + n);
    }
    ff.stdin.end(); await new Promise(r => ff.on("close", r));
    // música y efectos (audio.js) mezclados con el video, normalizados a -14 LUFS como piden las redes
    await new Promise((ok, mal) => spawn("node", [path.join(__dirname, "audio.js")], { stdio: "inherit" }).on("close", c => c ? mal(c) : ok()));
    const final = path.join(__dirname, "crisol-trailer.mp4");
    await new Promise((ok, mal) => spawn("ffmpeg", ["-y", "-loglevel", "error", "-i", salida, "-i", path.join(__dirname, "audio.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.82:level=false", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", final], { stdio: "inherit" }).on("close", c => c ? mal(c) : ok()));
    console.log("listo: " + final);
  }
  console.log("errores:", errores.length ? errores.join(" | ") : "ninguno");
  await b.close();
})();
