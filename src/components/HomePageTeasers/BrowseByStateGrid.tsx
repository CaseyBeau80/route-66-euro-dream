import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stateData = [
  {
    name: "Illinois",
    slug: "illinois",
    abbr: "IL",
    teaser: "Where it all begins — Chicago to the Chain of Rocks Bridge.",
    image: "https://images.unsplash.com/photo-1640283690184-6c39613c428f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Missouri",
    slug: "missouri",
    abbr: "MO",
    teaser: "Meramec Caverns, Gateway Arch, and Ozark back roads.",
    image: "https://images.unsplash.com/photo-1666213847499-5f2ed4e972b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Kansas",
    slug: "kansas",
    abbr: "KS",
    teaser: "The shortest stretch — 13 miles of pure Mother Road charm.",
    image: "https://images.unsplash.com/photo-1591155411580-3d993b5d7106?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Oklahoma",
    slug: "oklahoma",
    abbr: "OK",
    teaser: "More drivable miles of original Route 66 than any other state.",
    image: "https://images.unsplash.com/photo-1653377182370-f0d7fa0137d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Texas",
    slug: "texas",
    abbr: "TX",
    teaser: "Cadillac Ranch, the Big Texan, and wide-open Panhandle skies.",
    image: "https://images.unsplash.com/photo-1649561205931-c58c4ecd26ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "New Mexico",
    slug: "new-mexico",
    abbr: "NM",
    teaser: "Turquoise skies, adobe towns, and the Blue Hole of Santa Rosa.",
    image: "https://images.unsplash.com/photo-1660759161396-e12862b979c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Arizona",
    slug: "arizona",
    abbr: "AZ",
    teaser: "Painted Desert, Meteor Crater, and the spirit of Radiator Springs.",
    image: "https://images.unsplash.com/photo-1708636574009-1f69f3046f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "California",
    slug: "california",
    abbr: "CA",
    teaser: "Desert ghost towns to the Santa Monica Pier — the grand finale.",
    image: "https://images.unsplash.com/photo-1655789488528-080e569bd5f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

const BrowseByStateGrid: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-route66-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-route66-gold/20 text-route66-brown px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <MapPin className="h-4 w-4" />
            <span>8 States, 2,448 Miles</span>
          </div>
          <h2 className="font-route66 text-3xl sm:text-4xl text-route66-brown mb-3">
            Explore Route 66 by State
          </h2>
          <p className="text-route66-brown/70 font-body max-w-2xl mx-auto">
            Each state has its own flavor. Pick one and start exploring.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {stateData.map((state) => (
            <Link key={state.slug} to={`/${state.slug}`} className="group">
              <Card className="overflow-hidden border-2 border-route66-border hover:border-route66-red bg-white shadow-[4px_4px_0_0_rgba(107,76,56,0.15)] hover:shadow-[2px_2px_0_0_rgba(192,57,43,0.2)] transition-all duration-200 rounded-sm h-full">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={state.image}
                    alt={`Route 66 through ${state.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={250}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-2 right-2 bg-route66-dark/80 text-white text-xs font-bold px-2 py-1 rounded-sm">
                    {state.abbr}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-route66 text-lg text-route66-blue group-hover:text-route66-red transition-colors">
                    {state.name}
                  </h3>
                  <p className="text-xs text-route66-brown/60 mt-1 line-clamp-2 font-body">
                    {state.teaser}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByStateGrid;
