// Demo for GSAP SVG Animation Component
import { Component } from "@/src/components/ui/connoisseur-stack-interactor.tsx";
import { InteractiveHoverButton } from "./interactive-hover-button.tsx";

export default function DemoOne() {
  return <Component />;
}

export function InteractiveHoverButtonDemo() {
  return (
    <div className="relative justify-center flex p-4">
      <InteractiveHoverButton text="Explore" />
    </div>
  );
}

