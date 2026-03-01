import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import carImg from "../assets/car.png";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef();
  const carRef = useRef();
  const trailRef = useRef();
  const letterRefs = useRef([]);
  const roadLinesRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1500", // More scroll distance for smoother feel
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Car Movement & Letter Interaction
      tl.to(carRef.current, {
        x: "125vw",
        ease: "none",
        onUpdate: function () {
          if (!carRef.current) return;
          const carRect = carRef.current.getBoundingClientRect();
          const carFront = carRect.left + carRect.width * 0.85;

          letterRefs.current.forEach((letter) => {
            if (letter) {
              const letterRect = letter.getBoundingClientRect();
              // When car passes a letter: Reveal, scale, and remove blur
              if (carFront >= letterRect.left) {
                gsap.to(letter, {
                  opacity: 1,
                  color: "#fff",
                  filter: "blur(0px)",
                  scale: 1.1,
                  y: -5,
                  duration: 0.2,
                });
              } else {
                gsap.to(letter, {
                  opacity: 0.1,
                  color: "#333",
                  filter: "blur(4px)",
                  scale: 1,
                  y: 0,
                  duration: 0.2,
                });
              }
            }
          });

          // Update trail width to follow the back of the car
          gsap.set(trailRef.current, { width: carRect.left + carRect.width * 0.2 });
        },
      }, 0);

      // 2. Road Speed Effect (Moving the dashed lines)
      tl.to(roadLinesRef.current, {
        backgroundPosition: "-400px 0px",
        ease: "none",
      }, 0);

      // 3. Staggered Stat Box Reveal
      // We trigger these based on timeline progress
      const boxData = ["#box1", "#box2", "#box3", "#box4"];
      boxData.forEach((id, index) => {
        tl.to(id, {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "back.out(1.2)",
        }, (index + 1) * 0.15); // Staggered start times
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const text = "WELCOME ITZFIZZ";

  return (
    <div className="bg-[#050505] w-full h-screen font-sans selection:bg-emerald-500">
      <section
        ref={sectionRef}
        className="h-screen w-full relative overflow-hidden flex flex-col justify-center bg-[#050505]"
      >
        {/* Cinematic Background Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,20,20,1)_0%,_rgba(0,0,0,1)_100%)]" />
        
        {/* The Track/Road */}
        <div className="relative w-full h-[300px] flex items-center group">
          {/* Subtle Road Surface */}
          <div className="absolute inset-x-0 h-[2px] bg-white/10 top-0" />
          <div className="absolute inset-x-0 h-[2px] bg-white/10 bottom-0" />
          
          {/* Moving Road Lines */}
          <div 
            ref={roadLinesRef}
            className="absolute inset-x-0 h-[4px] top-1/2 -translate-y-1/2 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(90deg, #fff 50%, transparent 50%)',
              backgroundSize: '60px 100%'
            }}
          />

          {/* Green "Nitrous" Trail */}
          <div
            ref={trailRef}
            className="absolute left-0 h-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-400/60 w-0 z-10 blur-md border-r-2 border-emerald-400 shadow-[10px_0_30px_rgba(52,211,153,0.3)]"
          />

          {/* Main Typography */}
          <div className="absolute inset-0 flex items-center px-[10vw] z-20">
            <h1 className="text-[9vw] font-[1000] flex select-none italic tracking-tighter leading-none uppercase">
              {text.split("").map((char, i) => (
                <span
                  key={i}
                  ref={(el) => (letterRefs.current[i] = el)}
                  className="inline-block opacity-10 blur-sm transition-all duration-300 pointer-events-none"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
          </div>

          {/* The Car Container */}
          <div 
            ref={carRef} 
            className="absolute left-[-30vw] z-30 flex items-center justify-center pointer-events-none"
          >
            <img
              src={carImg}
              className="h-[200px] w-auto object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.9)]"
              alt="car"
            />
            {/* Dynamic Underglow */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-emerald-500/40 blur-[30px] rounded-full" />
          </div>
        </div>

        {/* Floating Data UI */}
        <div className="absolute inset-0 pointer-events-none p-12">
          <StatCard id="box1" color="bg-[#def54f]" pos="top-[12%] left-[15%]" value="58%" label="Pick up point use" />
          <StatCard id="box2" color="bg-white" pos="bottom-[12%] left-[35%]" value="27%" label="User retention" />
          <StatCard id="box3" color="bg-[#6ac9ff]" pos="top-[15%] right-[25%]" value="23%" label="Efficiency gain" />
          <StatCard id="box4" color="bg-[#fa7328]" pos="bottom-[15%] right-[10%]" value="40%" label="Cost reduction" />
        </div>
      </section>
      
      
    </div>
  );
}

// Reusable Stat Card Component for cleaner code
function StatCard({ id, color, pos, value, label }) {
  return (
    <div 
      id={id} 
      className={`absolute ${pos} opacity-0 -translate-x-12 scale-90 blur-md ${color} p-6 w-64 rounded-2xl shadow-2xl transition-all`}
      style={{ transform: 'skewX(-15deg)' }}
    >
      <div style={{ transform: 'skewX(15deg)' }}>
        <h2 className="text-5xl font-[1000] text-black leading-none italic">{value}</h2>
        <p className="text-black font-black uppercase text-[10px] tracking-widest mt-2 opacity-80 leading-tight">
          {label}
        </p>
      </div>
    </div>
  );
}