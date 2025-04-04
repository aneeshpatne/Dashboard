import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
const prisma = new PrismaClient();
interface Params {
  slug: string;
}
export async function GET(req: Request, context: { params: Params }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    const links = await prisma.shortUrl.findUnique({
      where: { shortUrl: slug },
    });
    if (!links) {
      return Response.json({ error: "Does Not Exist" }, { status: 404 });
    }
    return Response.json({ links }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
