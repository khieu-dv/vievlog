"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import * as React from "react";

import Image from "next/image";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

type Testimonial = {
  id: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  rating: number;
};

type TestimonialCarouselProps = {
  testimonials: Testimonial[];
  autoplay?: boolean;
  autoplayInterval?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function TestimonialCarousel({
  testimonials,
  autoplay = true,
  autoplayInterval = 5000,
  className,
  ...props
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const totalTestimonials = testimonials.length;

  const nextTestimonial = React.useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalTestimonials);
  }, [totalTestimonials]);

  const prevTestimonial = React.useCallback(() => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + totalTestimonials) % totalTestimonials,
    );
  }, [totalTestimonials]);

  React.useEffect(() => {
    if (!autoplay || isPaused) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, autoplayInterval);

    return () => {
      clearInterval(interval);
    };
  }, [autoplay, autoplayInterval, isPaused, nextTestimonial]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={`star-${star}`}
            className={cn(
              "h-4 w-4",
              star <= rating ? "fill-yellow-400" : "fill-gray-300",
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...props}
    >
      {/* Navigation controls - now outside the main content area with better positioning */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Customer Testimonials</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main carousel area */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="min-w-full shrink-0 border-none shadow-none"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Quote className="mb-4 h-10 w-10 text-primary/20" />
                <p className="mb-6 text-lg font-medium leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="mb-4">{renderStars(testimonial.rating)}</div>
                <div className="flex flex-col items-center">
                  {testimonial.author.avatar && (
                    <div className="mb-3 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.author.avatar}
                        alt={testimonial.author.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 object-cover rounded-full"
                      />
                    </div>
                  )}
                  <div className="font-semibold">
                    {testimonial.author.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.author.role}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Indicator dots at the bottom */}
      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((testimonial, index) => (
          <button
            key={`indicator-${testimonial.id}`}
            type="button"
            className={cn(
              "h-2 rounded-full transition-all",
              index === activeIndex
                ? "bg-primary w-4"
                : "bg-primary/30 hover:bg-primary/50 w-2",
            )}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}