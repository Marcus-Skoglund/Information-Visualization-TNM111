import React from "react";
import ForceGraph2D from "react-force-graph-2d";

// Define props
interface GraphData {
  nodes: any[];
  links: any[];
}

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
  return (
    <ForceGraph2D
      graphData={graphData}
      width={800} // make this dynamic later if needed
      height={500}
      // Details-on-demand tooltips (on hover display character name + value)
      nodeLabel={(node: any) => `${node.name} (Scenes: ${node.value})`}
      linkLabel={(link: any) =>
        `${link.source.name} & ${link.target.name}: ${link.value} interactions`
      }
      // Update selected node
      onNodeClick={(node: any) => {
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
      nodeColor={(node: any) => {
        if (!selectedCharacter) return node.color; // Nobody selected
        return node.name === selectedCharacter ? node.color : "#e2e8f0"; // Highlight vs Gray
      }}
      // Size Logic
      nodeVal={(node: any) => {
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
  );
}
