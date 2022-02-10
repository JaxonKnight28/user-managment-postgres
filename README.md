npm init
npm i express pg uuid
npm i --save-dev dotenv

add the "start" and "dev" commands in the script element 
package.json
  "scripts": {
    "start": "node [YOUR-MAIN-ENTRY-FILE]",
    "dev": "node -r dotenv/config [YOUR-MAIN-ENTRY-FILE]"
  },