import React from "react";
import { AnimatedFeatureCard } from "./feature-card-1.tsx";

// Data for the feature cards
const features = [
  {
    index: "001",
    tag: "ZERO FEES",
    title: "No Service Charges. 100% Free Transparent Mentorship.",
    imageSrc: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-79XLKwCuOZGHdVcOlEApISx6x2nVd2.png&w=1000&q=75",
    color: "orange" as const,
  },
  {
    index: "002",
    tag: "ADMISSIONS",
    title: "A–Z Fast-Track Application & Partner University Offer Letters.",
    imageSrc: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-DtOMYxIaV2eptIhXTkorEzdNzhlgXK.png&w=1000&q=75",
    color: "purple" as const,
  },
  {
    index: "003",
    tag: "VISA DESK",
    title: "95% Visa Approval Rate With Mock Interview Preparation.",
    imageSrc: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-eDCSln4vQRsBBiP3mWirJOXYDyFO6q.png&w=1000&q=75",
    color: "blue" as const,
  },
];

export function FeatureCardDemo() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
      <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <AnimatedFeatureCard
            key={feature.index}
            index={feature.index}
            tag={feature.tag}
            title={feature.title}
            imageSrc={feature.imageSrc}
            color={feature.color}
          />
        ))}
      </div>
    </div>
  );
}

export default FeatureCardDemo;
