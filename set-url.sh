#!/usr/bin/env bash
# Usage: ./set-url.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME
# Fills in the real website address so WhatsApp/Facebook link previews show the photo.
set -e
[ $# -ne 2 ] && { echo "Usage: ./set-url.sh GITHUB_USERNAME REPO_NAME"; exit 1; }
sed -i.bak "s|YOUR-USERNAME|$1|g; s|YOUR-REPO|$2|g" index.html && rm -f index.html.bak
echo "Done. Your site will be at: https://$1.github.io/$2/"
