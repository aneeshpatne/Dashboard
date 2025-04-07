import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.get("/", (req, res) => {
  res.send(`
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
      <h1>Welcome 👋</h1>
      <p>This is Aneesh's custom URL shortener service.</p>
      <a href="https://aneeshpatne.com">Back to main site</a>
    </body>
    </html>
  `);
});

app.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: "Please enter a slug" });
  }

  try {
    const record = await prisma.shortUrl.findUnique({
      where: { shortUrl: slug },
    });

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    return res.redirect(302, record.longUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;
