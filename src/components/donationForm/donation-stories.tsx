"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Pause, Play, Volume2, VolumeX } from "lucide-react";
import "@/components/css/stories.css";

interface Story {
  id: number;
  title: string;
  thumbnail: string;
  media: string;
  type: "image" | "video";
  videoUrl?: string;
  caption: string;
}

const STORIES_DATA: Story[] = [
  {
    id: 1,
    title: "ห้องคอมพิวเตอร์ปัจจุบัน",
    thumbnail: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    media: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    type: "image",
    caption: "ห้องคอมพิวเตอร์ปัจจุบันของโรงเรียนที่มีคอมพิวเตอร์เพียง 15 เครื่องสำหรับนักเรียน 300 คน",
  },
  {
    id: 2,
    title: "นักเรียนของเรา",
    thumbnail: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    media: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    type: "image",
    caption: "นักเรียนกำลังเรียนรู้การเขียนโปรแกรมพื้นฐาน แต่ต้องใช้คอมพิวเตอร์ร่วมกันหลายคน",
  },
  {
    id: 3,
    title: "แผนการปรับปรุง",
    thumbnail: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    media: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    type: "image",
    caption: "แบบจำลองห้องคอมพิวเตอร์ใหม่หลังจากได้รับการสนับสนุน",
  },
  {
    id: 4,
    title: "ขอบคุณจากนักเรียน",
    thumbnail: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    media: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    type: "video",
    videoUrl: "https://example.com/video.mp4",
    caption: "ข้อความขอบคุณจากนักเรียนถึงผู้บริจาคทุกท่าน",
  },
  {
    id: 5,
    title: "ผลงานนักเรียน",
    thumbnail: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    media: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    type: "image",
    caption: "ผลงานการเขียนโปรแกรมของนักเรียนที่ได้รับรางวัลระดับจังหวัด",
  },
];

export default function DonationStories() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Memoize handleNextStory to prevent redefinition on every render
  const handleNextStory = useCallback(() => {
    if (currentStoryIndex < STORIES_DATA.length - 1) {
      setProgress(0);
      setTimeout(() => {
        setActiveStory(STORIES_DATA[currentStoryIndex + 1]);
        setCurrentStoryIndex(currentStoryIndex + 1);
      }, 200);
    } else {
      closeStory();
    }
  }, [currentStoryIndex]); // Dependency: currentStoryIndex

  // First useEffect (Progress bar management) - Line ~94
  useEffect(() => {
    if (activeStory && !isPaused) {
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(0);

      const duration = activeStory.type === "video" ? 15000 : 5000;
      const interval = 50;
      const increment = (interval / duration) * 100;

      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + increment;
        });
      }, interval);
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [activeStory, isPaused, handleNextStory]); // Added handleNextStory to dependencies

  // Second useEffect (Video playback control)
  useEffect(() => {
    if (videoRef.current && activeStory?.type === "video") {
      const videoElement = videoRef.current;

      const handleCanPlay = () => {
        if (!isPaused) {
          videoElement.play().catch(() => console.log("Video playback error"));
        }
      };

      videoElement.addEventListener("canplaythrough", handleCanPlay);

      return () => {
        videoElement.removeEventListener("canplaythrough", handleCanPlay);
      };
    }
  }, [isPaused, activeStory]);

  // Third useEffect (Duplicate progress bar logic) - Line ~146
  // Note: This seems redundant; I'll consolidate it with the first useEffect
  // Removed the duplicate useEffect since it’s identical to the first one

  const openStory = (story: Story) => {
    setActiveStory(story);
    setCurrentStoryIndex(STORIES_DATA.findIndex((s) => s.id === story.id));
    setProgress(0);
    setIsPaused(false);
  };

  const closeStory = () => {
    setActiveStory(null);
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (videoRef.current) videoRef.current.pause();
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setProgress(0);
      setTimeout(() => {
        setActiveStory(STORIES_DATA[currentStoryIndex - 1]);
        setCurrentStoryIndex(currentStoryIndex - 1);
      }, 200);
    }
  };

  // Fourth useEffect (Keyboard event listener)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeStory();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // No dependencies needed here since closeStory is stable

  const togglePause = () => setIsPaused((prev) => !prev);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeStory();
    }
  };

  return (
    <div className="stories-container">
      <h3 className="stories-title">เรื่องราวของโครงการ</h3>
      <div className="stories-list">
        {STORIES_DATA.map((story) => (
          <div key={story.id} className="story-item" onClick={() => openStory(story)}>
            <div className="story-thumbnail">
              <div className="story-ring">
                <Image src={story.thumbnail} alt={story.title} fill className="story-image" />
              </div>
            </div>
            <span className="story-title">{story.title}</span>
          </div>
        ))}
      </div>

      {activeStory && (
        <div className="story-modal" onClick={handleOutsideClick}>
          <button className="story-close" onClick={closeStory}>
            <X className="w-6 h-6" />
          </button>

          <div className="story-progress">
            {STORIES_DATA.map((story, index) => (
              <div key={story.id} className="progress-bar">
                {index === currentStoryIndex && (
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                )}
                {index < currentStoryIndex && <div className="progress-fill" style={{ width: "100%" }} />}
              </div>
            ))}
          </div>

          <button
            className="story-nav story-nav-left"
            onClick={handlePreviousStory}
            disabled={currentStoryIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="story-nav story-nav-right"
            onClick={handleNextStory}
            disabled={currentStoryIndex === STORIES_DATA.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="story-controls">
            <button className="control-button" onClick={togglePause}>
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            {activeStory.type === "video" && (
              <button className="control-button" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>

          <div className="story-content">
            {activeStory.type === "image" ? (
              <Image src={activeStory.media} alt={activeStory.title} fill className="story-media" />
            ) : (
              <video
                ref={videoRef}
                src={activeStory.videoUrl}
                className="story-media"
                autoPlay
                playsInline
                muted={isMuted}
              />
            )}
            <div className="story-caption">
              <p className="caption-title">{activeStory.title}</p>
              <p className="caption-text">{activeStory.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}