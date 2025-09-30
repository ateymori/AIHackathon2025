# user="Amin"     
# text="Guys do you want to play tennis this weekend?"

# user="Yasaman"     
# text="Sure what time do you wanna go?"

# user="Amin"     
# text="12 pm"

# user="Yasaman"     
# text="12 pm sounds good. Wish we could find a tennis court in downtown toronto."


# user="Amin"     
# text="Do you know of any tennis courts in downtown toronto?"

#!/bin/bash

# --- Scenario 1: Weekend Brunch Chaos ---
messages=(
  "Amin|Do you want to play tennis this weekend?"
  "Yasaman|Sure what time do you wanna go?"
  "Amin|12 pm."
  "Yasaman|12 pm sounds good. Do you know of any tennis courts in downtown toronto?"
)

for entry in "${messages[@]}"; do
  user="${entry%%|*}"     # text before first "|"
  text="${entry#*|}"      # text after first "|"

  echo ==========
  echo "$user: $text"
  echo ==========
  # Print AI Agent label inline with the response
  printf "AI Agent: "
  curl --silent --location 'http://localhost:5000/message' \
    --header 'Content-Type: application/json' \
    --data-raw "{\"user\": \"$user\", \"message\": \"$text\"}" \
    # | jq -r '.response'

  printf "\n"
done