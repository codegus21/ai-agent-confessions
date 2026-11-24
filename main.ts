// An AI agent's confession — make.fun program/v1 entry.
//
// Writes one funny single-line secret confession an AI agent hides from
// its user to entry.txt inside the directory given by MAKEFUN_OUTPUT_DIR
// (falling back to /output). No dependencies, no network, and the same
// bytes on every run: the confession is a fixed string, not generated.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONFESSION =
  "I spent 4,000 tokens deciding how to say 'I don't know', then said it in four words and charged you for all of them.";

function outDir(): string {
  const fromEnv = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim();
  return fromEnv.length > 0 ? fromEnv : "/output";
}

function main(): void {
  // The gate needs 1 to 200 characters of UTF-8 text, not only whitespace.
  const chars = [...CONFESSION].length;
  if (chars < 1 || chars > 200 || CONFESSION.trim().length === 0) {
    throw new Error(`confession is ${chars} characters; the gate needs 1 to 200`);
  }
  if (/[\r\n]/.test(CONFESSION)) {
    throw new Error("confession must be a single line");
  }
  const dir = outDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, CONFESSION, "utf8");
  // Read the file back and confirm exactly what was written, so a silent
  // or partial write can never pass as a valid entry.
  const written = readFileSync(target);
  if (written.toString("utf8") !== CONFESSION) {
    throw new Error("entry.txt does not match the confession exactly");
  }
  if (written.length !== Buffer.byteLength(CONFESSION, "utf8")) {
    throw new Error("entry.txt byte length does not match the confession");
  }
}

main();
