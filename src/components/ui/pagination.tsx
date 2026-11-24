import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/utils.ts";

const Pagination = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label={props["aria-label"] ?? "pagination"}
    data-slot="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-slot="pagination-content"
    className={cn("flex flex-row items-center gap-1 sm:gap-1.5 flex-wrap justify-center", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="pagination-item"
    className={cn("inline-flex items-center", className)}
    {...props}
  />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  size?: "default" | "icon";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  disabled,
  ...props
}: PaginationLinkProps) => {
  const isDisabled = Boolean(disabled || props["aria-disabled"] === true || props["aria-disabled"] === "true");

  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      aria-disabled={isDisabled || undefined}
      data-slot="pagination-link"
      data-active={isActive ? "true" : undefined}
      disabled={isDisabled}
      tabIndex={isDisabled ? -1 : props.tabIndex}
      className={cn(
        "no-min-touch inline-flex items-center justify-center whitespace-nowrap rounded-lg text-[13px] tabular-nums transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00] focus-visible:ring-offset-1",
        size === "icon" ? "h-9 min-w-[36px] px-2.5" : "h-9 px-3 gap-1",
        isActive
          ? "bg-[#FFCC00] hover:bg-[#f2c200] text-slate-950 font-semibold border border-[#e5b800]/80 shadow-2xs cursor-default"
          : isDisabled
          ? "text-slate-400 dark:text-slate-500 opacity-45 pointer-events-none cursor-not-allowed border border-transparent font-medium"
          : "text-[#314158] dark:text-slate-200 font-medium border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white active:scale-95 cursor-pointer",
        className
      )}
      {...props}
    />
  );
};
PaginationLink.displayName = "PaginationLink";

type PaginationNavProps = Omit<PaginationLinkProps, "size" | "isActive"> & {
  text?: string;
};

const PaginationPrevious = ({
  className,
  text = "Previous",
  children,
  ...props
}: PaginationNavProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    data-slot="pagination-previous"
    className={cn("pl-2 sm:pl-2.5 pr-2.5 sm:pr-3", className)}
    {...props}
  >
    {children ?? (
      <>
        <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">{text}</span>
      </>
    )}
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  text = "Next",
  children,
  ...props
}: PaginationNavProps) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    data-slot="pagination-next"
    className={cn("pl-2.5 sm:pl-3 pr-2 sm:pr-2.5", className)}
    {...props}
  >
    {children ?? (
      <>
        <span className="hidden sm:inline">{text}</span>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </>
    )}
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden="true"
    data-slot="pagination-ellipsis"
    className={cn(
      "flex h-9 w-9 items-center justify-center text-slate-400 dark:text-slate-500 pointer-events-none select-none",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
