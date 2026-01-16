import HomeClientV2 from "@/components/home-client-v2";

export default function Page() {
  const photoUrl = process.env.NEXT_PUBLIC_PHOTO_URL ?? "/Roberto.jpeg";

  return <HomeClientV2 photoUrl={photoUrl} />;
}
