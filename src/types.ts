export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
}

export interface GameState {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  isGameOver: boolean;
  score: number;
  highscore: number;
}
