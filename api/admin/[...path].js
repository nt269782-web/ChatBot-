async function proxy(req, res) {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
        return res.status(500).json({
            error: "BACKEND_URL is not configured in Vercel."
        });
    }

    const url = new URL(req.url, `https://${req.headers.host}`);
    const target = `${backendUrl.replace(/\/$/, "")}${url.pathname}${url.search}`;

    try {
        const headers = {};
        if (req.headers["content-type"]) {
            headers["content-type"] = req.headers["content-type"];
        }
        if (req.headers["accept"]) {
            headers["accept"] = req.headers["accept"];
        }

        const options = {
            method: req.method,
            headers
        };

        if (!["GET", "HEAD"].includes(req.method)) {
            options.body = typeof req.body === "string"
                ? req.body
                : JSON.stringify(req.body);
        }

        const response = await fetch(target, options);
        const text = await response.text();

        res.status(response.status);

        const contentType = response.headers.get("content-type");
        if (contentType) {
            res.setHeader("Content-Type", contentType);
        }

        return res.send(text);
    } catch (error) {
        console.error("Backend proxy error:", error);
        return res.status(502).json({
            error: "Backend is unavailable."
        });
    }
}

module.exports = proxy;
