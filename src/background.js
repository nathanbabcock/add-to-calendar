chrome.contextMenus.create({
  id: "create-gcal-url",
  title: "Create Google Calendar event",
  contexts: ["selection"]
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "create-gcal-url") {
    chrome.storage.sync.get(["apiKey"], result => {
      chrome.tabs.insertCSS({
        code: 'body { cursor: wait; }'
      })
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
          + 'based on the following description. '
          + 'Respond with just the link by itself. '
          + `Take into account the user's local time is ${localTime} on ${localDate}. `
          + 'Include the location of the event if it is provided. '
          + 'The event description is as follows:'
          + '\n\n'
          + info.selectionText

        const messages = [
          { role: 'user', content: prompt }
        ]

        // const max_tokens = 256

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
              chrome.tabs.create({ url })
            })
        } catch (error) {
          alert(error.message)
          console.error(error)
        } finally {
          chrome.tabs.insertCSS({
            code: 'body { cursor: default; }'
          })
        }
      }
    })
  }
})