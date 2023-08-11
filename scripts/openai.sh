#!/bin/bash
source .env

echo $MESSAGE_JSON

# https://openai.com/blog/function-calling-and-other-api-updates
curl https://api.openai.com/v1/chat/completions \
  -u :$OPENAI_API_KEY \
  -H 'Content-Type: application/json' \
  -d '{
  "model": "gpt-3.5-turbo-0613",
  "messages": [
    {"role": "user", "content": "Create an \"add to google calendar\" link based on the following description. Respond with just the link by itself. The event description is as follows: \n\nJoin us for JavaScript and Friends Conference 2023, on August 25, 2023 at 8:00 AM."}
  ]
}'
