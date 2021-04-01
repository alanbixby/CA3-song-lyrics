const fs = require('fs')
const path = require('path')
const lyricsFinder = require('lyrics-finder')

// Unsure of the upstream API's rate limit, so I intentionally left this concurrency at 1
async function processSongs (songDir, outputDir = 'output_dir', unprocessedDir = 'unprocessed_dir', proccesedDir = 'processed_dir') {
  const songs = fs.readdirSync(path.join(__dirname, songDir))
  const processedSongs = fs.readdirSync(path.join(__dirname, proccesedDir))

  console.time(`Processed ${songs.length} files`)
  for (const file of songs) {
    if (processedSongs.includes(file)) {
      fs.renameSync(path.join(__dirname, songDir, file), path.join(__dirname, unprocessedDir, file))
      console.log(`- | Skipping; ${file} was already processed`)
      continue
    }
    const commands = fs.readFileSync(path.join(__dirname, songDir, file), 'utf-8').split('\n')
    const [title, artist] = commands
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
}

// Replace with the name of the input songs
processSongs('mellow_songs')
