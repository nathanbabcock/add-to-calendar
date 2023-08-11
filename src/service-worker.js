console.log('Add To Calendar service worker started')

chrome.contextMenus.create({
  id: "create-gcal-url",
  title: "Create Google Calendar event",
  contexts: ["selection"]
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "create-gcal-url") {
    chrome.storage.sync.get(["apiKey"], result => {
      // chrome.tabs.insertCSS({
      //   code: 'body { cursor: wait; }'
      // })
      if (result.apiKey === undefined) {
        alert("API key is not set. Please set it in the extension options.")
        chrome.runtime.openOptionsPage()
      } else {
        console.log({ selectionText: info.selectionText })

        const apiKey = result.apiKey
        const endpoint = "https://api.openai.com/v1/chat/completions"

        const now = new Date()
        const localTime = now.toLocaleTimeString()
        const localDate = now.toLocaleDateString()

        const model = "gpt-3.5-turbo-0613"
        const prompt = 'Create an "add to google calendar" link '
          + 'based on the following description:\n'
          + '- Respond with just the link by itself, as a raw URL.\n'
          + `- Take into account the user's local time is ${localTime} on ${localDate}.\n`
          + '- Include the location of the event if it is provided.\n'
          + '- Add an appropriate emoji at the beginning of the title.\n'
          + 'The event description is as follows:\n'
          + '\n'
          + info.selectionText

        const messages = [
          { role: 'user', content: prompt }
        ]

        console.log({ prompt })

        try {
          fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model,
              messages,
            })
          })
            .then(response => response.json())
            .then(data => {
              const url = data.choices[0].message.content
              console.log({ url })
              if (!url) return alert('Could not parse event from text.')
              if (!url.startsWith('http')) return alert(url)
              chrome.tabs.create({ url })
            })
        } catch (error) {
          alert(error.message)
          console.error(error)
        } finally {
          // chrome.tabs.insertCSS({
          //   code: 'body { cursor: default; }'
          // })
        }
      }
    })
  }
})

// 🔥 HOT RELOADING 🔥
// https://github.com/xpl/crx-hotreload
// todo: migrate to https://github.com/pacexy/mv3-hot-reload ?

// const filesInDirectory = dir => new Promise(resolve =>
//   dir.createReader().readEntries(entries =>
//     Promise.all(entries.filter(e => e.name[0] !== '.').map(e =>
//       e.isDirectory
//         ? filesInDirectory(e)
//         : new Promise(resolve => e.file(resolve))
//     ))
//       .then(files => [].concat(...files))
//       .then(resolve)
//   )
// )

// const timestampForFilesInDirectory = dir =>
//   filesInDirectory(dir).then(files =>
//     files.map(f => f.name + f.lastModifiedDate).join())

// const watchChanges = (dir, lastTimestamp) => {
//   timestampForFilesInDirectory(dir).then(timestamp => {
//     if (!lastTimestamp || (lastTimestamp === timestamp)) {
//       setTimeout(() => watchChanges(dir, timestamp), 1000) // retry after 1s
//     } else {
//       chrome.runtime.reload()
//     }
//   })
// }

// chrome.management.getSelf(self => {
//   if (self.installType === 'development') {
//     chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir))
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5
//       if (tabs[0]) {
//         chrome.tabs.reload(tabs[0].id)
//       }
//     })
//   }
// })