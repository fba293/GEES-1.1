import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";

export interface MenuItem {
  num: string;
  name: string;
  clipId: string;
  image: string;
  category?: string;
  desc?: string;
  badge?: string;
  slug?: string;
}

const defaultItems: MenuItem[] = [
  {
    num: "01",
    name: "STUDY IN MALAYSIA",
    clipId: "clip-original",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZd5n2tNuLtUbnkYxop24Dh6YXppoO22AesWMq9Da4U_hH8TSpxJJNI9Y_MBNshJzyKQcfIb8mPPWk0Mn0SVK1To7DY3uHnMLWe0B1YurXdva4mDR3KbXcAyqOo_xz3y4dg9yRenJJnoK3fziRYHUzfqdQ0JTWL0jBgdRRTMm6dwqPU72Xo-wGUcIwNmYEaiAnE_G-NZ9a3pU9GpcdoC78ZFo0PT9BQEGrMrHNQK4240l6syDpLlX3uw",
    category: "Study Destinations",
    desc: "Affordable world-class degrees, dual-award programs with UK/Australia, and streamlined student pass processing in Kuala Lumpur.",
    badge: "Top Asian Hub",
    slug: "study-in-malaysia"
  },
  {
    num: "02",
    name: "STUDY IN UNITED KINGDOM",
    clipId: "clip-hexagons",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn8SidT19xm-Ih2icXb6JpNK_tQqdmojSuthrT5rDbG33SBb7vwcaRsxzZQDYleO10CZl1E0vB-sQ8wKZahU3IiPEGxtlovG9Onwsd82BLPr0dLH6BN51_3NZysN6eCCyfA8USlwCV7w6HHENlvg8LFYqCTJ0tOF5aV_o8HfnK8YGZNsqH11KNogvM5lNGr1lD3K302jYGqKgVsPBOFL05mru2O5htVnecp2iyz7m6MYHtNlyRE_bPRg",
    category: "Study Destinations",
    desc: "World-renowned British education, 1-year master’s degrees, and 2-year Graduate Route Post-Study Work visa privileges.",
    badge: "Russell Group Unis",
    slug: "study-in-united-kingdom"
  },
  {
    num: "03",
    name: "STUDY IN AUSTRALIA",
    clipId: "clip-pixels",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHYlN5zXQ-dzjZHyIlwvfZcc2UWexdtmJFkTXVGzcaLfA_7dJQv7S82aFKUGhZRLClGa4BUZBdZ1QZudkqRCZ4doIlOOrnWPNoj3cdp-6-_Xfa3ec3Stitcm67A-2aNdthXMyfUs1D3GlgQnaVdfXExgN0pNouD198US-ufi3wNKdZ3X7zM8ZRo1v9zM_3SuvLZHkqSMJqA8t5MCLGzk_D6KMM6StuU1E0Nc7BW-7PZHiFJ849Af4pvA",
    category: "Study Destinations",
    desc: "Prestigious Group of Eight universities, exceptional lifestyle, part-time work rights, and post-study work visas.",
    badge: "Group of Eight",
    slug: "study-in-australia"
  },
  {
    num: "04",
    name: "STUDY IN NEW ZEALAND",
    clipId: "clip-original",
    image: "https://images.unsplash.com/photo-1507699622108-4be3ab695d3f?q=80&w=1200&auto=format&fit=crop",
    category: "Study Destinations",
    desc: "World-class education in innovative institutions like Te Pūkenga, stunning landscapes, and post-study work pathways.",
    badge: "Safe & Scenic",
    slug: "study-in-new-zealand"
  },
  {
    num: "05",
    name: "STUDY IN CYPRUS",
    clipId: "clip-hexagons",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
    category: "Study Destinations",
    desc: "Affordable European Union degrees taught in English, Mediterranean lifestyle, and excellent career opportunities across Europe.",
    badge: "EU Education Hub",
    slug: "study-in-cyprus"
  },
  {
    num: "06",
    name: "STUDY IN BELGIUM",
    clipId: "clip-pixels",
    image: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1200&auto=format&fit=crop",
    category: "Study Destinations",
    desc: "Multilingual academic excellence in Brussels and Flanders, rich cultural heritage, and central European mobility.",
    badge: "Heart of Europe",
    slug: "study-in-belgium"
  },
  {
    num: "07",
    name: "STUDY IN FINLAND",
    clipId: "clip-original",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop",
    category: "Study Destinations",
    desc: "Globally acclaimed education system, cutting-edge innovation hubs, English-taught degree programs, and high quality of life.",
    badge: "World-Best Education",
    slug: "study-in-finland"
  },
  {
    num: "08",
    name: "STUDY IN GREECE",
    clipId: "clip-hexagons",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop",
    category: "Study Destinations",
    desc: "Rich classical heritage combined with modern European degree programs, affordable living costs, and vibrant student life.",
    badge: "Historic & Affordable",
    slug: "study-in-greece"
  },
  {
    num: "09",
    name: "STUDY IN MAURITIUS",
    clipId: "clip-pixels",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200&auto=format&fit=crop",
    category: "Study Destinations",
    desc: "Safe, bilingual island nation hosting international branch campuses of UK and French universities with affordable tuition.",
    badge: "Tropical Study Haven",
    slug: "study-in-mauritius"
  },
  {
    num: "10",
    name: "STUDY IN NETHERLANDS",
    clipId: "clip-original",
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1200&auto=format&fit=crop",
    category: "Study Destinations",
    desc: "Over 2,100 English-taught programs, highly international campuses, vibrant innovation ecosystems, and orientation year visas.",
    badge: "English-Taught Leader",
    slug: "study-in-netherlands"
  },
  {
    num: "11",
    name: "STUDY IN INDIA",
    clipId: "clip-hexagons",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop",
    category: "Study Destinations",
    desc: "World-class IITs, IIMs, and premier medical & engineering institutions offering affordable global education standards.",
    badge: "Emerging Tech Powerhouse",
    slug: "study-in-india"
  }
];

export const Component = ({
  items = defaultItems,
  className,
  onItemClick
}: { 
  items?: MenuItem[]; 
  className?: string;
  onItemClick?: (item: MenuItem, index: number) => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const mainGroupRef = useRef<SVGGElement>(null);
  const masterTl = useRef<gsap.core.Timeline | null>(null);

  const createLoop = (index: number) => {
    const item = items[index];
    if (!item) return;
    const selector = `#${item.clipId} .path`;

    if (masterTl.current) masterTl.current.kill();

    if (imageRef.current) {
      imageRef.current.setAttribute("href", item.image);
      imageRef.current.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", item.image);
    }
    if (mainGroupRef.current) mainGroupRef.current.setAttribute("clip-path", `url(#${item.clipId})`);
    
    gsap.set(selector, { scale: 0, transformOrigin: "50% 50%" });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    // 1. IN (Expo Out)
    tl.to(selector, {
      scale: 1,
      duration: 0.8,
      stagger: { amount: 0.4, from: "random" },
      ease: "expo.out",
    })
    // 2. IDLE (Sine Breath)
    .to(selector, {
      scale: 1.05,
      duration: 1.5,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut",
      stagger: { amount: 0.2, from: "center" }
    })
    // 3. OUT (Expo In)
    .to(selector, {
      scale: 0,
      duration: 0.6,
      stagger: { amount: 0.3, from: "edges" },
      ease: "expo.in",
    });

    masterTl.current = tl;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createLoop(0);
    }, containerRef);
    return () => ctx.revert();
  }, [items]);

  const handleItemHover = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    createLoop(index);
  };

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "flex flex-col md:flex-row items-center justify-between min-h-screen w-full p-8 md:p-24 overflow-hidden transition-colors duration-500",
        "bg-white dark:bg-[#050505]", 
        className
      )}
    >
      
      {/* LEFT SIDE: HIGH CONTRAST MENU */}
      <div className="z-20 w-full md:w-1/2">
        <nav>
          <ul className="flex flex-col gap-14">
            {items.map((item, index) => {
              const words = item.name.split(' ');
              const firstWord = words[0];
              const restWords = words.slice(1).join(' ') || words[1] || '';

              return (
                <li
                  key={`${item.num}-${index}`}
                  onMouseEnter={() => handleItemHover(index)}
                  onClick={() => {
                    handleItemHover(index);
                    if (onItemClick) onItemClick(item, index);
                  }}
                  className="group cursor-pointer select-none"
                >
                  <div className="flex items-start gap-6">
                    {/* Numbers: Increased visibility for non-hover state */}
                    <span className={cn(
                      "text-3xl font-bold transition-all duration-500 mt-2 shrink-0",
                      activeIndex === index 
                        ? "text-orange-500 scale-110" 
                        : "text-zinc-400 dark:text-zinc-600" 
                    )}>
                      {item.num}
                    </span>
                    
                    {/* Main Text: Enhanced visibility logic */}
                    <h2 className={cn(
                      "text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] transition-all duration-700",
                      activeIndex === index 
                        ? "text-zinc-950 dark:text-white opacity-100 translate-x-4" 
                        // INACTIVE STATE: Increased from Zinc-200 to Zinc-400 for Light Mode
                        // Increased stroke visibility for Dark Mode (#52525b is Zinc-600)
                        : "opacity-40 translate-x-0 " + 
                          "text-zinc-500 dark:text-transparent " + 
                          "dark:[text-stroke:1.5px_#52525b] dark:[-webkit-text-stroke:1.5px_#52525b]"
                    )}>
                      {firstWord}
                      {restWords ? (
                        <>
                          <br />
                          {restWords}
                        </>
                      ) : null}
                    </h2>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* RIGHT SIDE: SQUARE GRID (Sharp Squares) */}
      <div className="relative w-full md:w-1/2 flex justify-center items-center mt-16 md:mt-0 md:sticky md:top-24">
        <div className="absolute w-[120%] h-[120%] bg-orange-500/10 dark:bg-orange-600/5 blur-[120px] rounded-full transition-opacity duration-1000 pointer-events-none" />
        
        <svg viewBox="0 0 500 500" className="w-[100%] max-w-[500px] h-auto z-10 drop-shadow-xl dark:drop-shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <defs>
            <clipPath id="clip-original">
              <path className="path" d="M480.6,235H19.4c-6,0-10.8-4.9-10.8-10.8v-9.5c0-6,4.9-10.8,10.8-10.8h461.1c6,0,10.8,4.9,10.8,10.8v9.5C491.4,230.2,486.6,235,480.6,235z" />
              <path className="path" d="M483.1,362.4H16.9c-4.6,0-8.3-3.7-8.3-8.3v-1.8c0-4.6,3.7-8.3,8.3-8.3h466.1c4.6,0,8.3,3.7,8.3,8.3v1.8C491.4,358.7,487.7,362.4,483.1,362.4z" />
              <path className="path" d="M460.3,336.3H39.7c-17.2,0-31.1-13.9-31.1-31.1v-31.5c0-17.2,13.9-31.1,31.1-31.1h420.7c17.2,0,31.1,13.9,31.1,31.1v31.5C491.4,322.4,477.5,336.3,460.3,336.3z" />
              <path className="path" d="M459.2,196.2H40.8v-35c0-47.5,38.5-86,86-86h246.5c47.5,0,86,38.5,86,86V196.2z" />
              <path className="path" d="M441.9,424.9H58.1c-9.6,0-17.3-7.8-17.3-17.3v-37.4h418.5v37.4C459.2,417.1,451.5,424.9,441.9,424.9z" />
            </clipPath>

            <clipPath id="clip-hexagons">
              <rect className="path" x="20" y="20" width="200" height="280" rx="12" />
              <rect className="path" x="20" y="320" width="200" height="160" rx="12" />
              <rect className="path" x="240" y="20" width="240" height="140" rx="12" />
              <rect className="path" x="240" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="370" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="240" y="360" width="240" height="120" rx="12" />
            </clipPath>

            {/* Grid Squares with rx="4" as requested */}
            <clipPath id="clip-pixels">
              {Array.from({ length: 9 }).map((_, i) => (
                <rect
                  key={i}
                  className="path"
                  x={(i % 3) * 160 + 20}
                  y={Math.floor(i / 3) * 160 + 20}
                  width="140"
                  height="140"
                  rx="4" 
                />
              ))}
            </clipPath>
          </defs>

          <g ref={mainGroupRef} clipPath={`url(#${items[0]?.clipId || 'clip-original'})`}>
            <image
              ref={imageRef}
              href={items[0]?.image}
              width="500"
              height="500"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export const ConnoisseurStackInteractor = Component;
export default Component;
