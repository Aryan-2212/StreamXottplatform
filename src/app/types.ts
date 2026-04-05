// Data types for StreamX

export type ContentType = 'movie' | 'show' | 'sports' | 'kids';
export type AccessType = 'included' | 'premium';
export type Genre = 'action' | 'comedy' | 'drama' | 'thriller' | 'horror' | 'romance' | 'sci-fi' | 'documentary' | 'animation' | 'sports' | 'kids';
export type Language = 'english' | 'hindi' | 'tamil' | 'telugu' | 'malayalam' | 'kannada' | 'marathi';

export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  type: ContentType;
  accessType: AccessType;
  genre: Genre[];
  language: Language;
  rating: number;
  duration: string;
  year: number;
  isHero?: boolean;
  trending?: boolean;
  progress?: number; // For continue watching (0-100)
}

export interface UserPreferences {
  languages: Language[];
  genres: Genre[];
  contentTypes: ContentType[];
  onboardingCompleted: boolean;
}
