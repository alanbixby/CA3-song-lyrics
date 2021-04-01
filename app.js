const fs = require('fs')
const path = require('path')
const lyricsFinder = require('lyrics-finder');

// Unsure of the upstream API's rate limit, so I intentionally left this concurrency 1
(async (songDir, outputDir, unprocessedDir, proccesedDir) => {
  const songs = fs.readdirSync(path.join(__dirname, songDir))
  console.time(`Processed ${songs.length} files`)
  for (const file of songs) {
    const text = fs.readFileSync(path.join(__dirname, songDir, file), 'utf-8').split('\n')
    const [title, artist] = text
    try {
      if (!title || !artist) { throw new Error(`Missing title or artist in ${file}`) }
      const lyrics = await lyricsFinder(artist, title)
      const outputFileName = file.replace('song-info', 'song-lyrics')
      fs.writeFileSync(path.join(__dirname, outputDir, outputFileName), lyrics)
      fs.renameSync(path.join(__dirname, songDir, file), path.join(__dirname, proccesedDir, file))
      console.log(`✓ | Processed ${title} by ${artist}`)
    } catch (err) {
      console.error(`X | Could not process ${title} by ${artist} [${file}] : ${err}`)
      fs.renameSync(path.join(__dirname, songDir, file), path.join(__dirname, unprocessedDir, file))
    }
  }
  console.timeEnd(`Processed ${songs.length} files`)
  process.exit()
})('mellow_songs', 'output_dir', 'unprocessed_dir', 'processed_dir')
