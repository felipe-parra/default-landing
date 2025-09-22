"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "konsta/react"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function AlphabetPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLButtonElement | null)[]>([])

  const scrollToCurrentLetter = (index: number) => {
    const letterElement = letterRefs.current[index]
    if (letterElement && carouselRef.current) {
      letterElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }

  useEffect(() => {
    scrollToCurrentLetter(currentIndex)
  }, [currentIndex])

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : ALPHABET.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev < ALPHABET.length - 1 ? prev + 1 : 0))
  }

  const goToLetter = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <>
      <style jsx>{`
        .carousel-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="h-screen w-full bg-gray-900 text-white flex flex-col overflow-hidden">
        {/* Main letter display */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[16rem] font-bold text-center select-none">
            {ALPHABET[currentIndex]}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <Button
            onClick={goToPrevious}
            className="!bg-white/10 !text-white border-0 rounded-full p-3"
          >
            <IoChevronBack className="w-8 h-8" />
          </Button>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <Button
            onClick={goToNext}
            className="!bg-white/10 !text-white border-0 rounded-full p-3"
          >
            <IoChevronForward className="w-8 h-8" />
          </Button>
        </div>

        {/* Alphabet carousel at bottom */}
        <div className="flex-shrink-0 p-4 bg-black/20">
          <div
            ref={carouselRef}
            className="carousel-container flex justify-center overflow-x-auto"
            style={{
              maxHeight: "80px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex space-x-2 min-w-max px-4 py-1">
              {ALPHABET.map((letter, index) => (
                <button
                  key={letter}
                  ref={el => {
                    letterRefs.current[index] = el
                  }}
                  onClick={() => goToLetter(index)}
                  className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full text-sm sm:text-lg font-semibold transition-all duration-200 flex-shrink-0
                  ${
                    index === currentIndex
                      ? "bg-blue-500 text-white scale-110"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }
                `}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
