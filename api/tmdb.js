export default async function handler(req, res) {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Missing TMDB_API_KEY" });
    }

    const rawPath = req.query.path || "";
    const tmdbPath = Array.isArray(rawPath) ? rawPath.join("/") : String(rawPath);
    if (!tmdbPath) {
        return res.status(400).json({ error: "Missing TMDB path" });
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
        if (key === "path") {
            continue;
        }

        if (Array.isArray(value)) {
            value.forEach((item) => params.append(key, item));
        } else if (value !== undefined) {
            params.append(key, String(value));
        }
    }

    params.set("api_key", apiKey);

    const targetUrl = `https://api.themoviedb.org/3/${tmdbPath}?${params.toString()}`;

    try {
        const upstream = await fetch(targetUrl, {
            headers: { accept: "application/json" },
        });

        const body = await upstream.text();
        res
            .status(upstream.status)
            .setHeader(
                "Content-Type",
                upstream.headers.get("content-type") || "application/json; charset=utf-8"
            )
            .send(body);
    } catch {
        res.status(502).json({ error: "Could not reach TMDB upstream service" });
    }
}
