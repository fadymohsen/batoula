import { getCMSContent } from "@/lib/cms";
import HomeUI from "@/components/HomeUI";

export const revalidate = 0;

export default async function HomePage() {
  const content = await getCMSContent();

  return <HomeUI content={content} />;
}
