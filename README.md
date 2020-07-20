# HardPin
A makeshift solution to hard pin tabs in VS Code. See https://hard-pin.acmion.com for more details.

## Building and Running HardPin

Run these commands in a terminal. Note: You must have npm installed.

1. npm install
2. npx webpack --watch
3. Copy the code of /dist/main.js
4. Open VS Code
5. Help > Toggle Developer Tool > Console
6. Paste the code in to the console and execute
7. Enjoy

## Settings

To use a separate row for pinned tabs run the following command in the console (after completing step 6):

`HardPin.useDoubleRow(true)`

To revert back to a single row run:

`HardPin.useDoubleRow(false)`

## Keyboard Shortcut

Toggle the pin status of the active tab by pressing Shift + Alt + P (on Mac: Cmd + Option + P).