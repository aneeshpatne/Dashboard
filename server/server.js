import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.get("/:slug", async (req, res) => {
  const { slug } = req.params;
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
