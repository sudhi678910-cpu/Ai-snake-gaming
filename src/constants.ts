import { Song } from './types';

export const SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'SynthAI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: '2',
    title: 'Cyber Drift',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-67deba3063f9?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Circuit Flow',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1633533434228-59c55b11ca0f?w=800&auto=format&fit=crop&q=60'
  }
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 150;
