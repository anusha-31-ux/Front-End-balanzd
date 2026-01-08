import { useState } from "react";
import { Instagram, Twitter } from "lucide-react";
import trainer1 from "@/assets/Anusha_V.png";
import trainer2 from "@/assets/Hithesh.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Trainers Section Component
 * Showcases the expert trainers team
 */

interface Trainer {
  name: string;
  role: string;
  image: string;
  specialties: string[];
  shortBio: string;
  fullBio: string;
  vision: string;
}

const Trainers = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  const trainers: Trainer[] = [
    {
      name: "Anusha V",
      role: "Founder & Director",
      image: trainer1,
      specialties: ["Athlete", "Nutritionist", "Fitness Coach", "6+ Years Experience"],
      shortBio: "National-level player turned fitness coach, bringing discipline, consistency, and resilience to every client.",
      fullBio: "Sports shaped my entire identity. As a national-level player, I learned discipline, consistency, and resilience long before I stepped into the fitness industry. Over the past six years, while working with hundreds of clients, I realised one thing — people don't fail because they lack motivation; they fail because no one taught them how the body actually works. Balanzed was born from that thought — to bring simple science, clarity, and trust back into fitness.",
      vision: "My vision is to make health affordable and achievable for every Kannadiga. I believe transformation is not about extreme diets or heavy workouts — it's about daily habits, food awareness, and emotional balance. Through Balanzed, I want to guide people with the same honesty and compassion that built my own journey.",
    },
    {
      name: "Hithesh Amin",
      role: "Director",
      image: trainer2,
      specialties: ["Mr. Karnataka", "Certified Personal Trainer", "8+ Years Experience"],
      shortBio: "Mr. Karnataka titleholder with 8 years of experience training people from beginners to seasoned gym-goers.",
      fullBio: "With eight years in the fitness industry and the honour of being titled Mr. Karnataka, I've trained people of all levels — from complete beginners to seasoned gym-goers. One thing I truly believe is that anyone can get fit when the guidance is practical, structured, and rooted in real-life challenges.",
      vision: "At Balanzed, my focus is to design daily live sessions that are safe, effective, and easy for everyone to follow — working professionals, parents, or anyone starting afresh. Our goal isn't just workouts; it's building a community that grows together, stays consistent, and transforms with support.",
    },
  ];

  return (
    <section id="trainers" className="section-padding bg-secondary/30">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Meet The Team
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
            The Minds Behind <span className="text-primary">Balanzed</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Our certified trainers bring years of experience and passion 
            to help you achieve your fitness goals.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-[688px] mx-auto">
          {trainers.map((trainer) => (
            <div
              key={trainer.name}
              className="group relative overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:border-primary/50 card-hover"
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                
                {/* Social Icons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-2xl text-foreground">
                  {trainer.name}
                </h3>
                <p className="text-primary font-medium mb-2">{trainer.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{trainer.shortBio}</p>
                
                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {trainer.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Read More Button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedTrainer(trainer)}
                >
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Trainer Detail Modal */}
        <Dialog open={!!selectedTrainer} onOpenChange={() => setSelectedTrainer(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedTrainer && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedTrainer.image}
                      alt={selectedTrainer.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                      <DialogTitle className="font-display text-2xl text-foreground">
                        {selectedTrainer.name}
                      </DialogTitle>
                      <p className="text-primary font-medium">{selectedTrainer.role}</p>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Full Bio */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">About</h4>
                    <p className="text-muted-foreground leading-relaxed italic">
                      "{selectedTrainer.fullBio}"
                    </p>
                  </div>

                  {/* Vision */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Vision</h4>
                    <p className="text-muted-foreground leading-relaxed italic">
                      "{selectedTrainer.vision}"
                    </p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Trainers;
