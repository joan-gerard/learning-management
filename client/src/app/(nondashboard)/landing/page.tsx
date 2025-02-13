"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCarousel } from "@/hooks/useCarousel";
import { useGetCoursesQuery } from "@/state/api";

const FEATURED_TAGS = ["web dev", "IT", "react.js", "next.js", "python"];

const Landing = () => {
  const currentImage = useCarousel({ totalImages: 3 });
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});
  console.log("COURSES", courses);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="landing"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="landing__hero"
      >
        <div className="landing__hero-content">
          <h1 className="landing__title">Courses</h1>
          <p className="landing__description">
            This is a list of the courses you can enroll in.
            <br />
            Courses when you need them and want them
          </p>
          <div className="landing__cta">
            <Link href="/search">
              <div className="landing__cta-button">Search for courses</div>
            </Link>
          </div>
        </div>
        <div className="landing__hero-images">
          {["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"].map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`hero banner ${i + 1}`}
              fill
              priority={i === currentImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`landing__hero-image ${
                i === currentImage ? "landing__hero-image--active" : ""
              }`}
            />
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ amount: 0.3, once: true }}
        className="landing__featured"
      >
        <h2 className="landing__featured-title">Featured Courses</h2>
        <p className="landing__featured-description">
          From beginner to advanced, in all industries, we have the right
          courses just for you and preparing your entire journey for learning
          and making the most.
        </p>
        <div className="landing__tags">
          {FEATURED_TAGS.map((tag) => (
            <span key={tag} className="landing__tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="landing__courses">{/* COURSES DISPLAY */}</div>
      </motion.div>
    </motion.div>
  );
};

export default Landing;
