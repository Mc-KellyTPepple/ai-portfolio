import type { Metadata } from "next";
import DemoPage from "@/components/DemoPage";
import { plantDisease as demo } from "@/data/demos";

export const metadata: Metadata = {
  title: demo.metaTitle,
  description: demo.metaDescription,
  alternates: { canonical: demo.path },
  openGraph: {
    title: demo.metaTitle,
    description: demo.metaDescription,
    type: "article",
    url: demo.path,
  },
};

export default function PlantDiseasePage() {
  return <DemoPage demo={demo} />;
}
