import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

const videoUrl = "https://balanzedspaces.sgp1.cdn.digitaloceanspaces.com/videos/balanzed_intro_vid.mp4";

/**
 * Video Section Component
 * Clean full-screen video display with mute controls
 */
const VideoSection = () => {
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
    <section className="relative w-full bg-black md:min-h-screen md:flex md:items-center md:justify-center">
      {/* Full Video Display */}
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover md:h-full md:object-contain"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        controls={false}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Control Buttons */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-3 bg-background/80 hover:bg-background border border-primary/30 rounded-full text-primary hover:text-primary/80 transition-all duration-300"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="p-3 bg-background/80 hover:bg-background border border-primary/30 rounded-full text-primary hover:text-primary/80 transition-all duration-300"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </section>
  );
};

export default VideoSection;