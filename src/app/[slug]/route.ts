import { prisma } from "@/lib/prisma";
import { getShortLinkRedirect } from "@/actions/url-action";
import { shortSlugSchema } from "@/schemas/url-schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const parsedSlug = shortSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return Response.json({ error: "Short link not found." }, { status: 404 });
  }

  const link = await getShortLinkRedirect(parsedSlug.data);

  if (!link) {
    return Response.json({ error: "Short link not found." }, { status: 404 });
  }

  await prisma.link.update({
    where: { id: link.id },
    data: { clickCount: { increment: 1 } },
  });

  return Response.redirect(link.longUrl, 307);
}
