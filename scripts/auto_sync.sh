#!/bin/bash
# Auto-syncs /app to GitHub every 2 minutes when changes exist.
cd /app || exit 1
while true; do
  if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git -c user.name="Omnivexx" -c user.email="sdhim8055@gmail.com" commit -q -m "sync: $(date -u +%Y-%m-%dT%H:%M:%SZ)" 2>>/tmp/auto_sync_err.log
    git push -q origin main 2>>/tmp/auto_sync_err.log && echo "$(date -u +%H:%M:%S) pushed" >> /tmp/auto_sync.log
  fi
  sleep 120
done
