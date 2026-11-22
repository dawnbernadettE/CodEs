/**
 * main.js
 * Entry point — loads persisted data then hands off to the menu.
 */

'use strict';

const { StudentDB } = require('./StudentDB');
const { loadDB }    = require('./serial');
const { runMenu }   = require('./ui');

const DATA_FILE = 'students.json';

(async function main() {
    const db = new StudentDB();

    const result = loadDB(db, DATA_FILE);
    if (result.ok)
        console.log(`\n  ✔  ${result.message}`);
    else
        console.log(`\n  ─  No existing data file found — starting fresh.`);

    await runMenu(db);
})();
