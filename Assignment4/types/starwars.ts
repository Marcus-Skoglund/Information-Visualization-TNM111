// Types for the Star Wars data and functions

// ------------- the raw data -----------------
export interface RawCharacterNode {
  name: string;
  colour: string;
  value: number;
}

export interface RawGraphData {
  nodes: RawCharacterNode[];
  links: { source: number; target: number; value: number }[];
}

//----------------- Updated data -----------------
export interface CharacterNode {
  id: number;
  name: string;
  value: number;
  color: string;
  connectionCount: number;
}

export interface InteractionLink {
  source: number | CharacterNode; 
  target: number | CharacterNode;
  value: number;
}

export interface GraphData {
  nodes: CharacterNode[];
  links: InteractionLink[];
}

// ----------- Functions -------------
export interface NetworkGraphProps {
  graphData: GraphData;
  selectedCharacter: string | null;
  onNodeClick: (characterName: string | null) => void;
}

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export interface Option {
  value: string;
  label: string;
}

export interface DropdownProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (newValue: string) => void;
}