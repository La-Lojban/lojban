import { createWriteStream, mkdirSync } from "fs";
import { join } from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { Writable } from "stream";
import streamJson from "stream-json";
import StreamArray from "stream-json/streamers/StreamArray";

const LENSISKU_EN_JSON_URL = "https://lensisku.lojban.org/api/export/cached/en/json";
const outDir = join(__dirname, "../../assets/dumps");

function createCompactArrayWriter(outPath: string): Writable {
	const file = createWriteStream(outPath, { encoding: "utf8" });
	let first = true;
	return new Writable({
		objectMode: true,
		write(
			chunk: { key: number; value: unknown },
			_enc: BufferEncoding,
			callback: (error?: Error | null) => void
		) {
			try {
				if (first) {
					file.write("[");
					first = false;
				} else {
					file.write(",");
				}
				file.write(JSON.stringify(chunk.value));
				callback();
			} catch (err) {
				callback(err instanceof Error ? err : new Error(String(err)));
			}
		},
		final(callback: (error?: Error | null) => void) {
			file.write("]");
			file.end((err) => callback(err));
		},
	});
}

async function main() {
	const res = await fetch(LENSISKU_EN_JSON_URL);
	if (!res.ok) {
		throw new Error(`Failed to fetch dictionary: ${res.status} ${res.statusText}`);
	}
	if (res.body == null) {
		throw new Error("Response has no body");
	}
	mkdirSync(outDir, { recursive: true });
	const outPath = join(outDir, "en.json");
	const nodeStream = Readable.fromWeb(res.body as import("stream/web").ReadableStream);
	const parser = streamJson();
	const streamArray = StreamArray.streamArray();
	const writer = createCompactArrayWriter(outPath);
	await pipeline(nodeStream, parser, streamArray, writer);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
