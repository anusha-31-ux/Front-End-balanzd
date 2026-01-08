import { useState, useCallback, useRef } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import video1 from "../assets/videos/IMG_1134.mov";
import video2 from "../assets/videos/IMG_1143.mov";
import video3 from "../assets/videos/IMG_1144.mov";

/**
 * Transformation Journeys Section Component
 * Instagram Reels style vertical video slider with local videos
 */
const Transformations = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5]));
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Sample videos (using free sample video URLs)
  const reels = [
    {
      name: "Supreetha From Karnataka ",
      duration: "16 Weeks",
      //poster: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=700&fit=crop",
       video: "/videos/IMG_1143.MOV",
      views: "30.2K",
    },
    {
      name: "Triveni From UK",
      duration: "12 Weeks",
     // poster: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=700&fit=crop",
      video: "/videos/IMG_1134.MOV",
      views: "12.5K",
    },
    {
      name: "Ranjana From UK",
      duration: "20 Weeks",
     // poster: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=700&fit=crop",
       video: "/videos/IMG_1144.MOV",
      views: "15.1K",
    },
    {
      name: "Archana From Karnataka",
      duration: "24 Weeks",
      //poster: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=700&fit=crop",
      video: "/videos/IMG_1264.MOV",
      views: "9.8K",
    },
    // {
    //   name: "Chris's Progress",
    //   duration: "10 Weeks",
    //   poster: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=700&fit=crop",
    //   video: "https://www.w3schools.com/html/mov_bbb.mp4",
    //   views: "11.3K",
    // },
    // {
    //   name: "Amanda's Glow Up",
    //   duration: "18 Weeks",
    //   poster: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=700&fit=crop",
    //   video: "https://www.w3schools.com/html/movie.mp4",
    //   views: "7.6K",
    // },
  ];

  const handlePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingIndex === index) {
      video.pause();
      setPlayingIndex(null);
    } else {
      // Pause any currently playing video
      if (playingIndex !== null && videoRefs.current[playingIndex]) {
        videoRefs.current[playingIndex]?.pause();
      }
      video.play();
      setPlayingIndex(index);
    }
  };

  const toggleMute = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = new Set(mutedVideos);
    if (newMuted.has(index)) {
      newMuted.delete(index);
    } else {
      newMuted.add(index);
    }
    setMutedVideos(newMuted);
  };

  return (
    <section id="transformations" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Real Results
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
            TRANSFORMATION <span className="text-primary">JOURNEYS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Watch our members' incredible transformation reels
          </p>
        </div>

        {/* Reels Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary hover:text-background -ml-4 hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary hover:text-background -mr-4 hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {reels.map((reel, index) => (
                <div
                  key={reel.name}
                  className="flex-none w-[200px] md:w-[240px]"
                >
                  <div
                    className="group relative aspect-[9/16] rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer bg-card"
                    onClick={() => handlePlayPause(index)}
                  >
                    {/* Video Element */}
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={reel.video}
                      // poster={reel.poster}
                      className="w-full h-full object-cover"
                      loop
                      playsInline
                      muted={mutedVideos.has(index)}
                      onEnded={() => setPlayingIndex(null)}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
                    
                    {/* Play/Pause Button Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playingIndex === index ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                      <div className="bg-primary/90 rounded-full p-4">
                        {playingIndex === index ? (
                          <Pause className="w-8 h-8 text-background fill-current" />
                        ) : (
                          <Play className="w-8 h-8 text-background fill-current ml-1" />
                        )}
                      </div>
                    </div>

                    {/* Mute Button */}
                    <button
                      onClick={(e) => toggleMute(index, e)}
                      className="absolute top-3 left-3 bg-background/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {mutedVideos.has(index) ? (
                        <VolumeX className="w-4 h-4 text-foreground" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-foreground" />
                      )}
                    </button>

                    {/* Duration Badge */}
                    <div className="absolute top-3 right-3 bg-primary text-background text-xs font-bold px-2 py-1 rounded-full">
                      {reel.duration}
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                      <p className="text-foreground font-semibold text-sm truncate">
                        {reel.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {reel.views} views
                      </p>
                    </div>

                    {/* Reel Icon */}
                    <div className="absolute top-12 left-3">
                      <svg
                        className="w-5 h-5 text-foreground/80"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Transformations;
