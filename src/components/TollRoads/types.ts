
import { ReactNode } from 'react';

export type TollRoadsProps = {
  language: string;
};

export type TollRoadSection = {
  icon: ReactNode;
  title: string;
  content: string;
  tollStatus: 'free' | 'avoidable' | 'potential';
  stateAbbr: string;
  transponderInfo: string;
  avoidanceTip?: string;
  url: string;
  urlLabel: string;
};

export type EstimatedCosts = {
  title: string;
  description: string;
  freeRoute: string;
  details: {
    label: string;
    cost: string;
    avoidable: boolean;
  }[];
  avoidanceTip: string;
};

export type TollRoadLink = {
  name: string;
  url: string;
  description: string;
  transponderInfo: string;
  tollStatus: 'free' | 'avoidable' | 'potential';
  stateAbbr: string;
};

export type TollRoadLinks = {
  title: string;
  subtitle: string;
  links: TollRoadLink[];
  proTip: string;
};

export type TollRoadsContent = {
  title: string;
  subtitle: string;
  introText: string;
  sections: TollRoadSection[];
  estimatedCosts: EstimatedCosts;
  tollRoadLinks: TollRoadLinks;
};

export type TollRoadsContentMap = {
  [key: string]: TollRoadsContent;
};
