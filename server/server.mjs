import express from "express";
import { PrismaClient } from "@prisma/client";
import https from "https";
import http from "http";

const prisma = new PrismaClient();
const app = express();

function renderPage(message = "Welcome 👋", subtitle = "This is Aneesh's custom URL shortener service.") {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Aneesh's URL Shortener</title>
      <style>
        body {
          font-family: system-ui, sans-serif;
          background: #f7f8fa;
          color: #333;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        p {
          font-size: 1.2rem;
          color: #666;
          text-align: center;
        }
        a {
          margin-top: 1rem;
          padding: 0.6rem 1.2rem;
          background: #0070f3;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          background: #005dc1;
        }
      </style>
    </head>
    <body>
      <h1>${message}</h1>
      <p>${subtitle}</p>
      <a href="https://aneeshpatne.com">Back to main site</a>
      <p>Made with ❤️ by Aneesh Patne</p>
    </body>
    </html>
  `;
}

app.get("/", (req, res) => {
  res.send(renderPage());
});

app.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).send(renderPage("Oops!", "Please enter a slug."));
  }

  try {
    const record = await prisma.shortUrl.findUnique({
      where: { shortUrl: slug },
    });

    if (!record) {
      return res.status(404).send(renderPage("Invalid Slug", "No record found for this slug."));
    }

    const targetUrl = new URL(record.longUrl);
    const isSupabase = targetUrl.hostname.endsWith("supabase.co");

    if (isSupabase) {
      const client = targetUrl.protocol === 'https:' ? https : http;

      client.get(targetUrl.href, (proxyRes) => {
        res.statusCode = proxyRes.statusCode || 200;
        for (const [key, value] of Object.entries(proxyRes.headers)) {
          res.setHeader(key, value);
        }
        proxyRes.pipe(res);
      }).on('error', (err) => {
        console.error('Proxy error:', err);
        res.status(500).send(renderPage("Error", "Failed to proxy Supabase content."));
      });

    } else {
      return res.redirect(302, record.longUrl);
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send(renderPage("Server Error", String(error)));
  }
});



export default app;
