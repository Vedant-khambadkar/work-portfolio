import React from "react";
import EditorialSection, { type TextPart } from "../../common/EditorialSection";

export interface ClientProps {
  baseText?: React.ReactNode;
  revealedText?: React.ReactNode;
  onHoverChange?: (isHovered: boolean) => void;
}

const LAYER1_PARTS: TextPart[] = [
  { text: "Combining creativity and technology to build" },
  { text: "web experiences ", className: "text-[#f25536] font-bold" },
  { text: "beyond the ordinary." },
];

const LAYER2_PARTS: TextPart[] = [
  { text: "Turning ambitious ideas into" },
  { text: " digital experiences", className: "text-white font-bold" },
  { text: "that make an impact ." },
];

const Client: React.FC<ClientProps> = (props) => {
  return (
    <EditorialSection
      id="client"
      title="C L I E N T S"
      layer1Parts={LAYER1_PARTS}
      layer2Parts={LAYER2_PARTS}
      {...props}
    />
  );
};

export default Client;
