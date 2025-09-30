#!/bin/bash

# --- Scenario 1: Weekend Brunch Chaos ---

declare -A messages

messages["Faye"]="Brunch this weekend? 🍳"
messages["Yasaman"]="Yes, but not too far downtown please, I don’t want to take the streetcar for 40 minutes."
messages["Amin F."]="Guys, I live up at Steeles, downtown is a nightmare for me 😩."
messages["Sanaz"]="North York would be easier, but I don’t mind if you all want downtown."
messages["Amin B."]="Saturday works, but only in the morning. Soccer after 1pm."
messages["Faye"]="Oh, I’m busy Saturday morning… I can only do after 2pm."
messages["Yasaman"]="Hmm, I can’t do Saturday at all. Sunday only."
messages["Amin Sh."]="I’m flexible either day. Just don’t pick somewhere too far south."
messages["Amin F."]="If we do Sunday, earlier is better. I need to head back north by 3pm."
messages["Sanaz"]="I can adjust either way, really it’s fine 🙂."
messages["Faye"]="Okay this is confusing lol."
messages["Yasaman"]="Perfect 👏"
messages["Amin F."]="That’s much better. I’d never suggest Bloor but it’s fair."
messages["Sanaz"]="Honestly, saved us from 50 more messages 😂."

for key in "${!messages[@]}"; do
  user="${key% *}"      # everything before last space = user
  text="${messages[$key]}"

  echo ==========
  echo "$user: $text"
  echo ==========
  # Print AI Agent label inline with the response
  printf "AI Agent: "
  curl --silent --location 'http://localhost:5000/message' \
    --header 'Content-Type: application/json' \
    --data-raw "{\"user\": \"$user\", \"message\": \"$text\"}" \
    | jq -r '.response'

  printf "\n"
done