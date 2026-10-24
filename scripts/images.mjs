// Gera versões responsivas em AVIF e WebP de cada foto em assets-src/<pasta>/<nome>.<ext>
// e escreve src/content/images.json com dimensões e cor média (para reservar espaço sem CLS).
// Uso: npm run images
import sharp from 'sharp'
import { readdirSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { join, parse } from 'node:path'

const SRC = 'assets-src'
const OUT = 'public/images'
const WIDTHS = [480, 720, 960, 1600]
const manifest = {}

for (const folder of readdirSync(SRC)) {
  const dir = join(SRC, folder)
  if (!statSync(dir).isDirectory()) continue
  mkdirSync(join(OUT, folder), { recursive: true })
  for (const file of readdirSync(dir)) {
    const { name, ext } = parse(file)
    if (!/\.(jpe?g|png|webp|avif|heic)$/i.test(ext)) continue
    const img = sharp(join(dir, file)).rotate()
    const meta = await img.metadata()
    const w0 = meta.autoOrient?.width ?? meta.width
    const h0 = meta.autoOrient?.height ?? meta.height
    const widths = WIDTHS.filter((w) => w < w0).concat(w0 <= WIDTHS.at(-1) ? [w0] : []).slice(0, 4)
    for (const w of widths) {
      const r = img.clone().resize({ width: w, withoutEnlargement: true })
      await r.clone().webp({ quality: 78, effort: 5 }).toFile(join(OUT, folder, `${name}-${w}.webp`))
      await r.clone().avif({ quality: 52, effort: 4 }).toFile(join(OUT, folder, `${name}-${w}.avif`))
    }
    const { dominant } = await img.clone().stats()
    manifest[`${folder}/${name}`] = {
      w: w0, h: h0, widths,
      color: `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
    }
    console.log(`${folder}/${name}`, w0 + 'x' + h0, widths.join(','))
  }
}
writeFileSync('src/content/images.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(Object.keys(manifest).length, 'imagens')
