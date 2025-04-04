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
