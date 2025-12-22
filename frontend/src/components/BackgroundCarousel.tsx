import { useEffect, useState } from "react";

const backgroundImages = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80", // Code on laptop
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80", // Code editor
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80", // Laptop and coffee
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80", // Code on screen
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1920&q=80", // Laptop workspace
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80", // Team collaboration
];

export function BackgroundCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Background Images */}
      <div className="fixed inset-0 z-[-2]">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}
      </div>
      
      {/* Dark Overlay with Mesh Gradient */}
      <div 
        className="fixed inset-0 z-[-1]"
        style={{
          background: `
            radial-gradient(at 40% 20%, hsla(185, 100%, 50%, 0.12) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsla(263, 70%, 50%, 0.12) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsla(330, 100%, 50%, 0.08) 0px, transparent 50%),
            radial-gradient(at 80% 50%, hsla(150, 100%, 50%, 0.08) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(263, 70%, 50%, 0.12) 0px, transparent 50%),
            rgba(10, 10, 15, 0.82)
          `,
        }}
      />
    </>
  );
}
