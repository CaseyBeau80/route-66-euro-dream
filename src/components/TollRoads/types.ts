
import { ReactNode } from 'react';

export type TollRoadsProps = {
  language: string;
};

export type TollRoadSection = {
  icon: ReactNode;
  title: string;
  content: string;
};

export type EstimatedCosts = {
  title: string;
  description: string;
  details: string[];
};

export type TollRoadsContent = {
  title: string;
  subtitle: string;
  sections: TollRoadSection[];
  estimatedCosts: EstimatedCosts;
};

export type TollRoadsContentMap = {
  [key: string]: TollRoadsContent;
};
