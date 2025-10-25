import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  

  return (
    <div className="relative w-full h-68 rounded-lg overflow-hidden">
      {/* Slider Track */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={`Slide ${idx + 1}`}
            className="w-full flex-shrink-0 h-full object-cover"
          />
        ))}
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setActiveIndex(
                (prev) => (prev - 1 + images.length) % images.length
              )
            }
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
          >
            <ChevronLeft className="cursor-pointer" size={24} />
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
          >
            <ChevronRight className="cursor-pointer" size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 w-full flex justify-center gap-2">
          {images.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                idx === activeIndex ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
