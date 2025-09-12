export interface Course {
  name: string;
  level: string;
  duration: string;
  fees: string;
}

export interface OverviewPoint {
  heading: string;
  description: string;
}

export interface College {
  _id: string;
  name: string;
  streams: string[];
  locations: string[];
  positions: string;
  image?: string;
  brochure?: string;
  feeStructureDoc?: string;
  overview: {
    heading: string;
    description: string;
    points: OverviewPoint[];
  };
  courses: Course[];
  portalLink?: string;
  CollegeLink?: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}
