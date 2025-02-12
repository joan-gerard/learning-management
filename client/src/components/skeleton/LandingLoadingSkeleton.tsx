import React from "react";
import { Skeleton } from "../ui/skeleton";

const TOTAL_TAGS = 5;
const TOTAL_COURSES = 4;

const LandingLoadingSkeleton = () => {
  return (
    <div className="landing-skeleton">
      <div className="landing-skeleton__hero">
        <div className="landing-skeleton__hero-content">
          <Skeleton className="landing-skeleton__title" />
          <Skeleton className="landing-skeleton__subtitle" />
          <Skeleton className="landing-skeleton__subtitle-secondary" />
          <Skeleton className="landing-skeleton__button" />
        </div>
        <Skeleton className="landing-skeleton__hero-image" />
      </div>
      <div className="landing-skeleton__featured">
        <Skeleton className="landing-skeleton__featured-title" />
        <Skeleton className="landing-skeleton__featured-description" />

        <div className="landing-skeleton__tags">
          {Array.from({ length: TOTAL_TAGS }, (_, index) => (
            <Skeleton key={index} className="landing-skeleton__tag" />
          ))}
        </div>
        <div className="landing-skeleton__courses">
          {Array.from({ length: TOTAL_COURSES }, (_, index) => (
            <Skeleton key={index} className="landing-skeleton__course-card" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingLoadingSkeleton;
