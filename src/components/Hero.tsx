import { Button } from "@/components/ui/button";
import { ChevronDown, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

const videoUrl = "https://balanzedspaces.sgp1.cdn.digitaloceanspaces.com/videos/balanzed_intro_vid.mp4";

/**
 * Hero Section Component
 * Full-screen hero with background video for BALANZED
 */
const Hero = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      id="home"
      className="relative bg-black overflow-hidden pt-20 md:min-h-screen md:flex md:items-center md:justify-center"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="w-full h-auto object-contain md:absolute md:inset-0 md:h-full md:object-contain"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        controls={false}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      {/* Control Buttons */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2 md:gap-3 md:bottom-20">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-2 md:p-3 bg-background/80 hover:bg-background border border-primary/30 rounded-full text-primary hover:text-primary/80 transition-all duration-300"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={16} className="md:w-5 md:h-5" /> : <Play size={16} className="md:w-5 md:h-5" />}
        </button>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="p-2 md:p-3 bg-background/80 hover:bg-background border border-primary/30 rounded-full text-primary hover:text-primary/80 transition-all duration-300"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX size={16} className="md:w-5 md:h-5" /> : <Volume2 size={16} className="md:w-5 md:h-5" />}
        </button>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary animate-bounce"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default Hero;
