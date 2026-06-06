export interface PolaroidMemory {
  id: string;
  caption: string;
  imageUrl?: string;
  emoji?: string;
  date: string;
  rotation: number; // Rotation in degrees for realistic scatter
  x?: number; // absolute drag positions or relative coordinates
  y?: number;
}

export interface WishingCard {
  id: string;
  title: string;
  category: string;
  message: string;
  iconName: string; // key of lucide-react icon
  illustration: string; // elegant design description
}

export interface SecretWish {
  id: string;
  wish: string;
  timestamp: string;
}
