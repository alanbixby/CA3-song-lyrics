# Song Lyrics Generator for CA3
A quick NodeJS app I put together to convert `.song-info.txt` into `.song-lyrics.txt`.

1. Use `npm install` to install dependencies.
2. Create a directory of `.song-info.txt` files and replace the parameter of `processSongs` with the name of this directory.
3. Run the app with `node app.js`

Files will be processed by [lyrics-finder](https://www.npmjs.com/package/lyrics-finder), and moved to `processed_dir` and `unprocessed_dir` respectively; song lyric files will be found in `output_dir`.