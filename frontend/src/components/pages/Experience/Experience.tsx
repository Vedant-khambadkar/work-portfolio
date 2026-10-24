import React from "react";
import EditorialSection, { type TextPart } from "../../common/EditorialSection";

export interface ExperienceProps {
  baseText?: React.ReactNode;
  revealedText?: React.ReactNode;
  onHoverChange?: (isHovered: boolean) => void;
}

const BASE_PARTS: TextPart[] = [
  { text: "Experienced in building" },
  { text: "responsive web applications", className: "text-[#ea583a] font-bold" },
  { text: "interactive interfaces, animated websites, and immersive 3D experiences with a focus on performance and user experience." },
];

const REVEALED_PARTS: TextPart[] = [
  { text: "Experienced in leveraging" },
  { text: "AI tools to accelerate development", className: "text-white font-bold" },
  { text: "generate creative assets, streamline workflows, and build innovative, AI-powered web experiences." },
];

const Experience: React.FC<ExperienceProps> = (props) => {
  return (
    <EditorialSection
      id="experience"
      title="E X P E R I E N C E"
      layer1Parts={BASE_PARTS}
      layer2Parts={REVEALED_PARTS}
      {...props}
    />
  );
};

export default Experience;
