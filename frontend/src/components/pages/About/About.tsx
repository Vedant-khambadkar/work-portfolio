import React from "react";
import EditorialSection, { type TextPart } from "../../common/EditorialSection";

export interface AboutProps {
  baseText?: React.ReactNode;
  revealedText?: React.ReactNode;
  onHoverChange?: (isHovered: boolean) => void;
}

const LAYER1_PARTS: TextPart[] = [
  { text: "I combine" },
  { text: "modern web technologies", className: "text-[#f25536] font-bold" },
  { text: "to create innovative digital experiences through workflows, 3D visuals, and interactive animations." },
];

const LAYER2_PARTS: TextPart[] = [
  { text: "I combine" },
  { text: "AI-powered tools", className: "text-white font-bold" },
  { text: "with creative development to build innovative digital experiences, generate visual assets, and bring interactive ideas to life." },
];

const About: React.FC<AboutProps> = (props) => {
  return (
    <EditorialSection
      id="about"
      title="A B O U T &nbsp; M E"
      layer1Parts={LAYER1_PARTS}
      layer2Parts={LAYER2_PARTS}
      {...props}
    />
  );
};

export default About;
