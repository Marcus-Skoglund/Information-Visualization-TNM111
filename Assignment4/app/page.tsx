"use client"; // Run entirely in the browser

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Dropdown from "@/components/Dropdown";
const NetworkGraph = dynamic(() => import("@/components/NetworkGraph"), { ssr: false }); // Load on client side
import { CharacterNode, InteractionLink, GraphData } from "@/types/starwars"; // import types
import { getMaxConnections, getFilteredGraphData } from "@/utils/graphUtils"; // import weight function
import Slider from "@/components/Slider";

// Dropdown options
const dropdownOptions = [
  { value: "full", label: "All Episodes" },
  { value: "1", label: "Episode 1" },
  { value: "2", label: "Episode 2" },
  { value: "3", label: "Episode 3" },
  { value: "4", label: "Episode 4" },
  { value: "5", label: "Episode 5" },
  { value: "6", label: "Episode 6" },
  { value: "7", label: "Episode 7" },
];

// Helper function
const getFilePath = (selection: string) => {
  if (selection === "full") {
    return "/data/starwars-full-interactions-allCharacters.json";
  } else {
    return `/data/starwars-episode-${selection}-interactions-allCharacters.json`;
  }
};

export default function Home() {
  const [diagram1Data, setDiagram1Data] = useState<GraphData>({ nodes: [], links: [] });
  const [diagram2Data, setDiagram2Data] = useState<GraphData>({ nodes: [], links: [] });
  // "full" means all episodes
  const [selection1, setSelection1] = useState<string>("1"); // Default Episode 1
  const [selection2, setSelection2] = useState<string>("full"); // Default All Episodes
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [minLinkStrength1, setMinLinkStrength] = useState<number>(0);
  const [minLinkStrength2, setMinLinkStrength2] = useState<number>(0);

  // Fetch data when the component loads
  useEffect(() => {
    const loadData = async () => {
      try {
        const res1 = await fetch(getFilePath(selection1));
        const data1 = await res1.json();

        const res2 = await fetch(getFilePath(selection2));
        const data2 = await res2.json();

        // react-force-graph needs an ID
        // The dataset uses zero-based array indices for links, so we map the array index to an 'id'.
        const formatData = (data: any): GraphData => {
          const nodes: CharacterNode[] = data.nodes.map((node: any, index: number) => ({
            // take all data, add index, add color (which is colour), add amount of unique connections for each character
            ...node,
            id: index,
            color: node.colour,
            connectionCount: 0,
          }));
          const links: InteractionLink[] = data.links; // take the identical data
          // Calculate the number of connections for each node
          links.forEach((link: InteractionLink) => {
            // Increment count for the source node
            const sourceNode = nodes[link.source as number];
            if (sourceNode) sourceNode.connectionCount = (sourceNode.connectionCount || 0) + 1;

            // Increment count for the target node
            const targetNode = nodes[link.target as number];
            if (targetNode) targetNode.connectionCount = (targetNode.connectionCount || 0) + 1;
          });

          return { nodes, links };
        };

        setDiagram1Data(formatData(data1));
        setDiagram2Data(formatData(data2));
      } catch (error) {
        console.error("Error loading JSON data:", error);
      }
    };

    loadData();
  }, [selection1, selection2]);

  // DIAGRAM 1 LOGIC
  const maxConnections1 = useMemo(() => getMaxConnections(diagram1Data), [diagram1Data.nodes]);
  const filteredData1 = useMemo(
    () => getFilteredGraphData(diagram1Data, minLinkStrength1, selectedCharacter),
    [diagram1Data, minLinkStrength1, selectedCharacter],
  );

  // DIAGRAM 2 LOGIC (Exactly the same, just different data/strength variables)
  const maxConnections2 = useMemo(() => getMaxConnections(diagram2Data), [diagram2Data.nodes]);
  const filteredData2 = useMemo(
    () => getFilteredGraphData(diagram2Data, minLinkStrength2, selectedCharacter),
    [diagram2Data, minLinkStrength2, selectedCharacter],
  );

  return (
    <main className="min-h-screen p-8 bg-slate-50 text-slate-900">
      <h1 className="text-3xl font-bold text-center mb-8">Star Wars Character Interactions</h1>

      {/* Control Panel Area */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-200">
        <h2 className="text-xl font-semibold mb-6 text-center border-b pb-4 border-slate-100">
          Compare Episodes & Network Density
        </h2>

        {/* Using a grid to split the panel into two distinct columns */}
        <div className="flex flex-col lg:flex-row justify-around items-center gap-8 px-4 w-full">
          {/* Group 1: Controls for Diagram 1 */}
          <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:max-w-[25%]">
            <div className="shrink-0 w-full md:w-auto">
              <Dropdown
                label="Diagram 1 Data:"
                value={selection1}
                options={dropdownOptions}
                onChange={setSelection1}
              />
            </div>
            <div className="flex-grow w-full">
              <Slider
                label="Unique interactions:"
                value={minLinkStrength1}
                min={0}
                max={maxConnections1}
                onChange={setMinLinkStrength}
              />
            </div>
          </div>

          {/* Controls for Diagram 2 */}
          <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:max-w-[25%]">
            <div className="shrink-0 w-full md:w-auto">
              <Dropdown
                label="Diagram 2 Data:"
                value={selection2}
                options={dropdownOptions}
                onChange={setSelection2}
              />
            </div>
            <div className="flex-grow w-full">
              <Slider
                label="Unique interactions:"
                value={minLinkStrength2} // Ensure you use the second state variable here!
                min={0}
                max={maxConnections2} // Ensure you use the second max variable here!
                onChange={setMinLinkStrength2}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Network Diagrams Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Diagram 1 */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-center">Episode {selection1}</h3>
          <div className="h-[60vh] w-full border border-slate-100 bg-slate-50 overflow-hidden">
            {diagram1Data.nodes.length > 0 && (
              <NetworkGraph
                graphData={filteredData1}
                selectedCharacter={selectedCharacter}
                onNodeClick={setSelectedCharacter}
              />
            )}
          </div>
        </div>

        {/* Diagram 2 */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-center">Episode {selection2}</h3>
          <div className="h-[60vh] w-full border border-slate-100 bg-slate-50 overflow-hidden">
            {diagram2Data.nodes.length > 0 && (
              <NetworkGraph
                graphData={filteredData2}
                selectedCharacter={selectedCharacter}
                onNodeClick={setSelectedCharacter}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Episode 4 has an outlier (no edges)
