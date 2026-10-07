/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Universal Our Services - Integrated Shadcn-like 3D Coverflow Carousel
 */

import React from 'react';
import { mockServices } from '../../data/mockDatabase.ts';
import { ServiceItem } from '../../types/index.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { CoverflowCarousel } from '../ui/coverflow-carousel.tsx';

interface ServicesCoverflowProps {
  onSelectService: (service: ServiceItem) => void;
  onViewAllServices: () => void;
}

export const ServicesCoverflow: React.FC<ServicesCoverflowProps> = ({
  onSelectService,
  onViewAllServices
}) => {
  // Format mock services into the structure required by CoverflowCarousel
  const slides = mockServices.map((service) => ({
    src: service.imageUrl,
    alt: service.title,
    title: service.title,
    subtitle: service.category || "Consultancy Service",
    meta: [
      { label: "Category", value: service.category || "Education Advisor" },
      { label: "Admissions", value: "Partner Colleges" },
      { label: "Service Fee", value: "100% Free" }
    ]
  }));

  const handleCardClick = (index: number) => {
    onSelectService(mockServices[index]);
  };

  return (
    <section 
      aria-labelledby="geesServicesTitle"
      className="gees-services-coverflow relative w-full bg-white dark:bg-[#070b19] py-12 xs:py-16 sm:py-24 select-none border-b border-slate-100 dark:border-slate-800"
      data-home-section="services"
      id="home-services"
    >
      <div className="gees-services-coverflow__shell w-full flex flex-col items-center">
        {/* Section Heading matching index.html */}
        <div className="gees-services-coverflow__head text-center mb-6 sm:mb-12 px-4 max-w-5xl mx-auto">
          <div>
            <h2 
              className="gees-section-title text-base xs:text-xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center flex-nowrap sm:flex-wrap whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal gap-1.5 sm:gap-3"
              id="geesServicesTitle"
            >
              <span>Our</span>
              <span className="gees-section-highlight px-2 sm:px-5 py-0.5 sm:py-1 bg-[#fbb034] text-slate-950 rounded-lg sm:rounded-2xl inline-block shadow-sm font-black">
                Services
              </span>
            </h2>
            <p className="gees-services-coverflow__eyebrow text-[11px] xs:text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.22em] font-bold text-slate-500 dark:text-slate-400 uppercase mt-2 sm:mt-3 truncate sm:whitespace-normal">
              Everything you need, in one place
            </p>
          </div>
        </div>

        {/* 3D Coverflow Viewport Stage */}
        <div 
          aria-label="GEES services 3D coverflow"
          className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center py-2 px-4"
        >
          <CoverflowCarousel
            slides={slides}
            onCardClick={handleCardClick}
            rotate={38}
            depth={0.5}
            perspective={2.8}
            falloff={0.52}
            fade={0.12}
            cardWidth="clamp(220px, 28vw, 310px)"
            gap={0.12}
            loop={true}
            showCaption={false}
            showNavigation={true}
            showPagination={true}
            className="w-full"
            cardClassName="border-2 border-slate-200/80 dark:border-slate-800 shadow-xl cursor-pointer rounded-3xl"
          />
        </div>

        {/* Footer Link matching index.html */}
        <div className="gees-services-coverflow__footer mt-8 sm:mt-10 text-center">
          <InteractiveHoverButton
            type="button"
            text="View all services"
            onClick={onViewAllServices}
            className="px-8 py-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-300 dark:border-slate-700 font-bold text-sm shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesCoverflow;
