// Types for the Star Wars data and functions
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