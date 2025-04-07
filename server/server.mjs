import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the URL shortener redirect service!");
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
