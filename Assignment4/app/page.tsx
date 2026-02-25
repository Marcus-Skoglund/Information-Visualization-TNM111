"use client"; // Run entirely in the browser

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Dropdown from "@/components/Dropdown";
const NetworkGraph = dynamic(() => import("@/components/NetworkGraph"), { ssr: false }); // Load on client side

// Types for the Star Wars data
interface CharacterNode {
  id: number;
  name: string;
  value: number;
  color: string;
}

interface InteractionLink {
  source: number;
  target: number;
  value: number;
}

interface GraphData {
  nodes: CharacterNode[];
  links: InteractionLink[];
}

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
  // "full" means all episodes, "1" means Episode 1, etc
  const [selection1, setSelection1] = useState<string>("1"); // Default Episode 1
  const [selection2, setSelection2] = useState<string>("full"); // Default All Episodes
  // Selected character, starts with nobody selected.
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  // Fetch data when the component loads
  useEffect(() => {
    const loadData = async () => {
      try {
        const res1 = await fetch(getFilePath(selection1));
        const data1 = await res1.json();

        const res2 = await fetch(getFilePath(selection2));
        const data2 = await res2.json();

        // react-force-graph needs an 'id' property on nodes.
        // The dataset uses zero-based array indices for links, so we map the array index to an 'id'.
        const formatData = (data: any): GraphData => ({
          nodes: data.nodes.map((node: any, index: number) => ({
            // take all data, add index, add color (which is colour)
            ...node,
            id: index,
            color: node.colour,
          })),
          links: data.links, // take the identical data
        });

        setDiagram1Data(formatData(data1));
        setDiagram2Data(formatData(data2));
      } catch (error) {
        console.error("Error loading JSON data:", error);
      }
    };

    loadData();
  }, [selection1, selection2]);

  return (
    <main className="min-h-screen p-8 bg-slate-50 text-slate-900">
      <h1 className="text-3xl font-bold text-center mb-8">Star Wars Character Interactions</h1>

      {/* Control Panel Area */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-200">
        <h2 className="text-xl font-semibold mb-2">Select which episodes to compare</h2>
        <div className="flex justify-center space-x-100">
          <Dropdown
            label="Diagram 1 Data:"
            value={selection1}
            options={dropdownOptions}
            onChange={setSelection1}
          />
          <Dropdown
            label="Diagram 2 Data:"
            value={selection2}
            options={dropdownOptions}
            onChange={setSelection2}
          />
        </div>
      </div>

      {/* Network Diagrams Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Diagram 1 */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-center">Episode {selection1}</h3>
          <div className="h-[500px] w-full border border-slate-100 bg-slate-50 overflow-hidden">
            {diagram1Data.nodes.length > 0 && (
              <NetworkGraph
                graphData={diagram1Data}
                selectedCharacter={selectedCharacter}
                onNodeClick={setSelectedCharacter}
              />
            )}
          </div>
        </div>

        {/* Diagram 2 */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-center">Episode {selection2}</h3>
          <div className="h-[500px] w-full border border-slate-100 bg-slate-50 overflow-hidden">
            {diagram2Data.nodes.length > 0 && (
              <NetworkGraph
                graphData={diagram2Data}
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
