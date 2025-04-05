import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
const prisma = new PrismaClient();
export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const links = await prisma.shortUrl.findMany();
    return Response.json({ links });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { shortUrl, longUrl } = await req.json();

    if (!shortUrl || !longUrl) {
      return Response.json(
        { error: "Missing shortUrl or longUrl" },
        { status: 400 }
      );
    }

    const created = await prisma.shortUrl.upsert({
      where: { shortUrl },
      update: { longUrl },
      create: {
        shortUrl,
        longUrl,
      },
    });

    return Response.json({ message: "Saved", data: created }, { status: 200 });
  } catch (err) {
    console.log("POST error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { shortUrl } = await req.json();

    if (!shortUrl) {
      return Response.json({ error: "Missing shortUrl" }, { status: 400 });
    }

    await prisma.shortUrl.delete({
      where: { shortUrl },
    });

    return Response.json({ message: "Deleted from DB" }, { status: 200 });
  } catch (err) {
    console.error("DELETE error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
