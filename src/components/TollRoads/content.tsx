
import React from "react";
import { AlertTriangle, MapPin, Route } from "lucide-react";
import { TollRoadsContentMap } from "./types";

export const tollRoadsContent: TollRoadsContentMap = {
  en: {
    title: "Toll Roads on Route 66 – Mostly Toll-Free!",
    subtitle: "Historic Route 66 is largely toll-free when you stick to the original alignments",
    introText: "Historic Route 66 is largely toll-free when you follow the original alignments (old highways like SH-66 in Oklahoma). Modern interstates that parallel it may have tolls, but you can easily avoid them. The main toll road is in Oklahoma. Always check official sites for current rates, construction, and payment options before your 2026 centennial trip.",
    sections: [
      {
        icon: React.createElement(AlertTriangle, { className: "h-6 w-6" }),
        title: "Oklahoma Turnpike",
        content: "I-44 Turner Turnpike (Tulsa → OKC) is the primary toll you may encounter. Many drivers avoid this entirely by staying on FREE historic SH-66, which runs parallel and offers the authentic Route 66 experience.",
        tollStatus: "avoidable",
        stateAbbr: "OK",
        transponderInfo: "Uses PikePass — E-ZPass NOT accepted",
        avoidanceTip: "Stay on historic SH-66 to avoid tolls completely"
      },
      {
        icon: React.createElement(Route, { className: "h-6 w-6" }),
        title: "Illinois Tollway",
        content: "Some tolls exist near Chicago on modern roads (I-88, I-294). However, historic Route 66 alignments through Illinois are completely toll-free. You'll only hit tolls if you take modern expressways around Chicago.",
        tollStatus: "free",
        stateAbbr: "IL",
        transponderInfo: "Uses I-PASS (E-ZPass compatible)",
        avoidanceTip: "Historic Route 66 in Illinois is toll-free"
      },
      {
        icon: React.createElement(MapPin, { className: "h-6 w-6" }),
        title: "California FasTrak",
        content: "Tolls exist on some Bay Area bridges and express lanes, but these are NOT near Santa Monica where Route 66 ends. Historic Route 66 through California (Needles → Santa Monica) is completely toll-free.",
        tollStatus: "free",
        stateAbbr: "CA",
        transponderInfo: "E-ZPass NOT compatible with FasTrak",
        avoidanceTip: "Route 66 in California is toll-free"
      }
    ],
    estimatedCosts: {
      title: "Cost Comparison",
      description: "Following historic Route 66 keeps your trip toll-free. If you choose modern interstates, here are potential costs:",
      freeRoute: "Historic Route 66: FREE ✓",
      details: [
        { label: "Oklahoma I-44 Turner Turnpike", cost: "$6-12", avoidable: true },
        { label: "Illinois Tollway (Chicago area)", cost: "$5-15", avoidable: true },
        { label: "California bridges (if applicable)", cost: "$5-8", avoidable: true }
      ],
      avoidanceTip: "Stick to historic alignments to avoid all tolls!"
    },
    tollRoadLinks: {
      title: "Official Toll Road Websites",
      subtitle: "Check current rates and payment options before your trip",
      links: [
        {
          name: "Oklahoma Turnpike Authority",
          url: "https://www.pikepass.com/",
          description: "I-44 Turner Turnpike info. Most drivers avoid by taking free SH-66.",
          transponderInfo: "PikePass only — E-ZPass NOT accepted",
          tollStatus: "avoidable",
          stateAbbr: "OK"
        },
        {
          name: "Illinois Tollway",
          url: "https://www.illinoistollway.com/",
          description: "Chicago area tolls. Historic Route 66 through IL is toll-free.",
          transponderInfo: "I-PASS / E-ZPass accepted",
          tollStatus: "free",
          stateAbbr: "IL"
        },
        {
          name: "California FasTrak",
          url: "https://www.bayareafastrak.org/",
          description: "Bay Area bridges only. Route 66 to Santa Monica is toll-free.",
          transponderInfo: "FasTrak only — E-ZPass NOT accepted",
          tollStatus: "free",
          stateAbbr: "CA"
        }
      ],
      proTip: "For the authentic, toll-free Route 66 experience, follow historic alignments and avoid interstates like I-44 in Oklahoma. E-ZPass is only useful near Chicago — not needed for most of the route. Check road conditions and rates before your 2026 trip!"
    }
  }
};
