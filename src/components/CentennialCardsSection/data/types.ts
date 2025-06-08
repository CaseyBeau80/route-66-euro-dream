
import React from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CentennialCardData {
  id: string;
  title: string;
  subtitle: string | React.ReactNode;
  description: string;
  icon: React.ReactNode;
  route: string;
  accentColor: string;
  buttonText: string;
  sparkleColor: string;
  content: React.ReactNode;
}
