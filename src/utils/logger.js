/**
 * Logs
 *
 * @author Paulo Venoy
 */
import pkg from "../../package.json" with { type: "json" };

export function sayLog(message) {
  console.log("\x1b[36m[VENOY BOT | TALK]\x1b[0m", message);
}

export function inputLog(message) {
  console.log("\x1b[30m[VENOY BOT | INPUT]\x1b[0m", message);
}

export function infoLog(message) {
  console.log("\x1b[34m[VENOY BOT | INFO]\x1b[0m", message);
}

export function successLog(message) {
  console.log("\x1b[32m[VENOY BOT | SUCCESS]\x1b[0m", message);
}

export function errorLog(message) {
  console.log("\x1b[31m[VENOY BOT | ERROR]\x1b[0m", message);
}

export function warningLog(message) {
  console.log("\x1b[33m[VENOY BOT | WARNING]\x1b[0m", message);
}

export function bannerLog() {
  console.log(`\x1b[36m░█░█░█▀▀░█▀█░█▀█░█░█░░░█▀▄░█▀█░▀█▀\x1b[0m`);
  console.log(`░▀▄▀░█▀▀░█░█░█░█░░█░░░░█▀▄░█░█░░█░`);
  console.log(`\x1b[36m░░▀░░▀▀▀░▀░▀░▀▀▀░░▀░░░░▀▀░░▀▀▀░░▀░\x1b[0m`);
  console.log(`\x1b[36m🤖 VENOY BOT - Versão: \x1b[0m${pkg.version}\n`);
}

