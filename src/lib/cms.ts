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

// Utility to get a specific key with fallback and locale support
export function getContent(map: Record<string, string>, key: string, fallback: string, locale: string = "ar") {
  const localeKey = `${key}_${locale}`;
  // Priority: 1. Localized key (e.g. hero_title_en), 2. Default key (hero_title), 3. Fallback string
  return map[localeKey] || map[key] || fallback;
}
