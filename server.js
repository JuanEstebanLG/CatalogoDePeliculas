const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { URL } = require("node:url");
const fsSync = require("node:fs");

loadDotEnv();

const PORT = process.env.PORT || 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const ROOT_DIR = process.cwd();

const CONTENT_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
};

if (!TMDB_API_KEY) {
    console.error("Missing TMDB_API_KEY environment variable.");
    process.exit(1);
}

const server = http.createServer(async (req, res) => {
    try {
        const requestUrl = new URL(req.url, `http://${req.headers.host}`);

        if (requestUrl.pathname.startsWith("/api/tmdb/")) {
            await proxyTmdb(requestUrl, res);
            return;
        }

        await serveStatic(requestUrl.pathname, res);
    } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Internal server error" }));
    }
});

async function proxyTmdb(requestUrl, res) {
    const tmdbPath = requestUrl.pathname.replace("/api/tmdb/", "");
    if (!tmdbPath) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Missing TMDB path" }));
        return;
    }

    const params = new URLSearchParams(requestUrl.searchParams);
    params.set("api_key", TMDB_API_KEY);

    const target = `${TMDB_BASE_URL}/${tmdbPath}?${params.toString()}`;
    try {
        const upstream = await fetch(target, {
            headers: { accept: "application/json" },
        });

        const body = await upstream.text();
        res.writeHead(upstream.status, {
            "Content-Type":
                upstream.headers.get("content-type") || "application/json; charset=utf-8",
        });
        res.end(body);
    } catch {
        res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Could not reach TMDB upstream service" }));
    }
}

async function serveStatic(urlPathname, res) {
    const relativePath = urlPathname === "/" ? "index.html" : urlPathname.slice(1);
    const safePath = path.normalize(relativePath).replace(/^(\.\.[\\/])+/, "");
    const filePath = path.join(ROOT_DIR, safePath);

    if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
    }

    try {
        const content = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const type = CONTENT_TYPES[ext] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": type });
        res.end(content);
    } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
    }
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

function loadDotEnv() {
    const envPath = path.join(process.cwd(), ".env");
    if (!fsSync.existsSync(envPath)) {
        return;
    }

    const content = fsSync.readFileSync(envPath, "utf8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
            continue;
        }

        const separatorIndex = trimmed.indexOf("=");
        if (separatorIndex === -1) {
            continue;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        let value = trimmed.slice(separatorIndex + 1).trim();

        if (
            (value.startsWith("\"") && value.endsWith("\"")) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        if (!(key in process.env)) {
            process.env[key] = value;
        }
    }
}
