// Types for the Star Wars data
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