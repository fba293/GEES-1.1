import { InteractiveHoverButton } from "./interactive-hover-button.tsx";
import { Hero } from "./animated-hero";

function InteractiveHoverButtonDemo() {
  return (
    <div className="relative justify-center">
      <InteractiveHoverButton text="Apply Now" />
    </div>
  );
}

function HeroDemo() {
  return (
    <div className="block">
      <Hero />
    </div>
  );
}

export { InteractiveHoverButtonDemo, HeroDemo };
