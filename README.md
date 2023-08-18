# Add To Calendar 📆

Chrome extension to create Google calendar events from selected text.

Forked from <https://github.com/htadashi/GPT3-Event-Scheduler>:

- Updated for Chrome extension manifest v3
- Updated for GPT 3.5 model OpenAI API

## Demo

![demo](https://user-images.githubusercontent.com/2355491/210706757-323e764e-ee9f-464d-baf8-475c8862bb18.gif)
**Disclaimer**: This extension is not affiliated with the webpage shown above.

## Installation

To install the extension:

1. Download the ZIP file and unzip to a folder.
2. In Chrome, go to chrome://extensions and enable developer mode.
3. Click "Load unpacked" and select the unzipped folder.

## TODO

> **📣 PR's welcome!**

- [ ] Parse location and determine exact address
- [ ] Determine timezone from location and convert if needed
- [ ] Handle recurrence
- [ ] Probably port to OpenAI function calls and construct the URL manually
- [ ] Add entire selected text to calendar description (explicitly)
- [ ] (later) Automatically find website link(s)

## See also

- [List of all known "create event" URL parameters](https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md)
