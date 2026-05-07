import prisma from "./prisma";

export async function getCMSContent() {
  try {
    const contents = await prisma.content.findMany();
    const contentMap: Record<string, string> = {};
    contents.forEach(item => {
      contentMap[item.key] = item.value;
    });
    return contentMap;
  } catch (error) {
    console.error("Failed to fetch CMS content", error);
    return {};
  }
}

// Utility to get a specific key with fallback
export function getContent(map: Record<string, string>, key: string, fallback: string) {
  return map[key] || fallback;
}
