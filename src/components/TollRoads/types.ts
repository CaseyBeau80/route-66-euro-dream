
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

export type TollRoadLink = {
  name: string;
  url: string;
  description: string;
};

export type TollRoadLinks = {
  title: string;
  subtitle: string;
  links: TollRoadLink[];
};

export type TollRoadsContent = {
  title: string;
  subtitle: string;
  sections: TollRoadSection[];
  estimatedCosts: EstimatedCosts;
  tollRoadLinks: TollRoadLinks;
};

export type TollRoadsContentMap = {
  [key: string]: TollRoadsContent;
};
