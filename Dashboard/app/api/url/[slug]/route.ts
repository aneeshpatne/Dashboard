import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { slug } = context.params;
    const links = await prisma.shortUrl.findUnique({
      where: { shortUrl: slug },
    });

    if (!links) {
      return new Response(JSON.stringify({ error: "Does Not Exist" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ links }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
