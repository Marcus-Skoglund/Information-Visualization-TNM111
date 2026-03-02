// utils/graphUtils.ts
import { GraphData, CharacterNode } from "@/types/starwars";

// checks if it's an object (character) or still a number, returns number
const getLinkId = (linkPart: number | CharacterNode): number => {
  if (typeof linkPart === "object") {
    return linkPart.id;
  }
  return linkPart;
};

//Calculates the maximum connection count in a dataset
export const getMaxConnections = (data: GraphData): number => {
  if (data.nodes.length === 0) return 10;
  return Math.max(...data.nodes.map((n) => n.connectionCount || 0));
};

// Filters the graph data based on connection and neighbors.
export const getFilteredGraphData = (
  data: GraphData,
  minStrength: number,
  selectedChar: string | null
): GraphData => {
  // Initial Filter by connections
  let nodes = data.nodes.filter((node) => node.connectionCount >= minStrength);
  let links = data.links;

  // Neighbor selection filter
  if (selectedChar) {
    const selectedNode = nodes.find((n) => n.name === selectedChar);

    if (selectedNode) { // get all that has selected character in source or target
      const neighborLinks = links.filter((link) => {
        const sId = getLinkId(link.source);
        const tId = getLinkId(link.target);
        return sId === selectedNode.id || tId === selectedNode.id;
      });
      // create set, add all connected to set (O(1) for set)
      const neighborIndices = new Set<number>();
      neighborIndices.add(selectedNode.id);

      neighborLinks.forEach((link) => {
        neighborIndices.add(getLinkId(link.source));
        neighborIndices.add(getLinkId(link.target));
      });

      return {
        nodes: nodes.filter((node) => neighborIndices.has(node.id)),
        links: neighborLinks,
      };
    }
    return { nodes: [], links: [] }; // Fallback if selected character is filtered out
  }

  // Filter links to match nodes
  const activeIndices = new Set(nodes.map((n) => n.id)); // list of character that should be visable
  const filteredLinks = links.filter((link) => {
    const sId = getLinkId(link.source);
    const tId = getLinkId(link.target);
    return activeIndices.has(sId) && activeIndices.has(tId);
  });

  return { nodes, links: filteredLinks };
};