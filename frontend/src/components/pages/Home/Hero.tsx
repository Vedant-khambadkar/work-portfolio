import HeroText from "./HeroText";

interface HeroProps {
  baseText?: React.ReactNode;
  revealedText?: React.ReactNode;
  onHoverChange?: (isHovered: boolean) => void;
  isLoaded?: boolean;
}

const Hero = ({
  baseText,
  revealedText,
  onHoverChange,
  isLoaded = false,
}: HeroProps) => {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-between relative">
      <div className="header w-full h-12 sm:h-16"></div>

      <div className="main w-full flex-1 flex items-center justify-center relative px-4 md:px-0">
        {/* Dual-expression hero text: lens expands from cursor to reveal alternative message */}
        <HeroText
          baseText={baseText}
          revealedText={revealedText}
          onHoverChange={onHoverChange}
          isLoaded={isLoaded}
        />
      </div>
    </section>
  );
};

export default Hero;
