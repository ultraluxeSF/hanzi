# Chinese from Zero

A personal, step-by-step Mandarin course as a Progressive Web App (PWA).
Open it in Safari or Chrome and choose **Add to Home Screen**: it then runs full-screen like an app and works offline.

## Features

- Sequential lessons: each one unlocks after the previous one is finished
- Pinyin above every character, coloured by tone (can be turned off in Settings)
- Audio for every word and sentence (normal and slow), using the device's Chinese voice
- Stroke-order animation and tracing with finger, mouse or Apple Pencil (pressure-sensitive, palm rejection)
- Exercises: listen → meaning, read → meaning, meaning → hanzi, match pairs, build the sentence, tone recognition
- Spaced-repetition review deck
- Dictionary: A–Z by pinyin or English, search, and topic filters (animals, technology, food…)
- Progress saved on the device, with export/import to move between iPad and phone

## Structure

```
index.html            app shell
manifest.webmanifest  PWA manifest (name, icons, full-screen)
sw.js                 service worker (offline cache) — bump VERSION on every release
css/style.css         all styles
js/app.js             screens, lesson player, exercises
js/course.js          course content (modules, lessons, words, patterns, dialogues)
js/dictionary.js      dictionary words by topic
js/writer.js          stroke-order trainer
js/audio.js           audio playback (recorded files first, then device voice)
js/storage.js         progress, spaced repetition, settings
data/chars/           stroke data for each character used
audio/                optional recorded mp3 files (audio/<hanzi>.mp3, listed in audio/index.json)
```

## Adding content

- New lesson: add an entry to a module's `lessons` in `js/course.js`. Sentences use the `汉字:pīn yīn/` token format.
- New dictionary word: add a line `汉字 | pīn yīn | English` under a topic in `js/dictionary.js`.
- New characters need stroke data in `data/chars/` (one JSON file per character, listed in `data/chars/index.json`).

## Credits

Stroke data from [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) (Arphic Public License),
packaged by [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data).
