import React, { useRef, useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d"; // https://vasturiano.github.io/react-force-graph/
import { CharacterNode, InteractionLink, GraphData } from "@/types/starwars"; // import types

interface NetworkGraphProps {
  graphData: GraphData;
  selectedCharacter: string | null;
  onNodeClick: (characterName: string | null) => void;
}

export default function NetworkGraph({
  graphData,
  selectedCharacter,
  onNodeClick,
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions when window resizes
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {dimensions.width > 0 && (
        <ForceGraph2D
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          // Details-on-demand tooltips (on hover display character name + value)
          nodeLabel={(node: CharacterNode) => `${node.name} (Scenes: ${node.value})`}
          linkLabel={(link: InteractionLink) => {
            const s = link.source;
            const t = link.target;

            // Use guard to check if source/target have become objects
            if (typeof s === "object" && typeof t === "object") {
              return `${s.name} & ${t.name}: ${link.value} interactions`;
            }
            return `${link.value} interactions`;
          }}
          // Update selected node
          onNodeClick={(node: CharacterNode) => {
            if (node.name === selectedCharacter) {
              // deselecting if pressing same twice
              onNodeClick(null);
            } else {
              onNodeClick(node.name); // select node if none already selected
            }
          }}
          // Deselect node if pressing background
          onBackgroundClick={() => onNodeClick(null)}
          // Highlight node logic
          nodeColor={(node: CharacterNode) => {
            if (!selectedCharacter) return node.color; // Nobody selected
            return node.name === selectedCharacter ? node.color : "#e2e8f0"; // Highlight vs Gray
          }}
          // Size Logic
          nodeVal={(node: CharacterNode) => {
            // base size
            const baseSize = 3;

            // Multiply selected characters size to make them pop more
            if (node.name === selectedCharacter) {
              return baseSize * 3;
            }

            // Otherwise return normal size
            return baseSize;
          }}
        />
      )}
    </div>
  );
}
