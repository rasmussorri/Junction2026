#!/bin/bash
cd "$(dirname "$0")"
echo "Cancer Strategy Monitor: http://localhost:8765  (keep this window open)"
if ! command -v python3 >/dev/null 2>&1; then echo "python3 is missing. Install: xcode-select --install"; read -n 1; exit 1; fi
(sleep 1.5; open "http://localhost:8765") &
python3 server.py
echo "Server stopped. Press any key to close."; read -n 1
