import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, DollarSign, ExternalLink, Globe, MapPin, Tag } from 'lucide-react';
import type { AttractionData } from '@/types/attractionDetail';

interface AttractionDetailSectionsProps {
  attraction: AttractionData;
  nearbyStops: AttractionData[];
  stateName: string;
  fallbackImage: string;
}

const infoItemClasses =
  'bg-surface border-2 border-border rounded-sm p-4 shadow-[4px_4px_0_hsl(var(--border)/0.3)]';

const AttractionDetailSections: React.FC<AttractionDetailSectionsProps> = ({
  attraction,
  nearbyStops,
  stateName,
  fallbackImage,
}) => {
  const infoItems = [
    {
      key: 'state',
      label: 'State',
      value: stateName,
      icon: MapPin,
      isLink: false,
    },
    {
      key: 'category',
      label: 'Category',
      value: attraction.category,
      icon: Tag,
      isLink: false,
    },
    {
      key: 'admission',
      label: 'Admission Fee',
      value: attraction.admission_fee,
      icon: DollarSign,
      isLink: false,
    },
    {
      key: 'hours',
      label: 'Hours of Operation',
      value: attraction.hours_of_operation,
      icon: Clock,
      isLink: false,
    },
    {
      key: 'website',
      label: 'Website',
      value: attraction.website,
      icon: Globe,
      isLink: true,
    },
  ].filter((item) => Boolean(item.value));

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('ramble66:open-chat'));
  };

  return (
    <div className="space-y-10">
      {attraction.description && (
        <section
          aria-labelledby="big-bo-says"
          className="bg-surface border-2 border-border border-l-[10px] border-l-primary rounded-sm p-6 shadow-[4px_4px_0_hsl(var(--primary)/0.25)]"
        >
          <p className="font-special text-xs uppercase tracking-wide text-primary mb-3">Big Bo Says</p>
          <h2 id="big-bo-says" className="font-heading text-2xl text-foreground mb-3">
            Why this stop earns a spot on your Route 66 map
          </h2>
          <p className="font-body text-foreground leading-relaxed text-lg">
            Big Bo here — {attraction.description}
          </p>
          <p className="font-special text-sm uppercase text-primary mt-4">Don&apos;t drive past this one.</p>
        </section>
      )}

      {infoItems.length > 0 && (
        <section aria-labelledby="need-to-know">
          <div className="mb-4">
            <p className="font-special text-xs uppercase tracking-wide text-primary mb-2">Need to Know</p>
            <h2 id="need-to-know" className="font-heading text-2xl text-foreground">
              Quick details before you roll in
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {infoItems.map((item) => {
              const Icon = item.icon;

              return item.isLink ? (
                <a
                  key={item.key}
                  href={item.value ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${infoItemClasses} hover:border-primary transition-colors`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-special text-xs uppercase text-muted-foreground block mb-1">
                        {item.label}
                      </span>
                      <span className="font-body text-sm text-primary break-all inline-flex items-center gap-2">
                        {(item.value || '').replace(/^https?:\/\/(www\.)?/, '')}
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </a>
              ) : (
                <div key={item.key} className={infoItemClasses}>
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-special text-xs uppercase text-muted-foreground block mb-1">
                        {item.label}
                      </span>
                      <span className="font-body text-sm text-foreground">{item.value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {nearbyStops.length > 0 && (
        <section aria-labelledby="nearby-stops">
          <div className="mb-4">
            <p className="font-special text-xs uppercase tracking-wide text-primary mb-2">Nearby Stops</p>
            <h2 id="nearby-stops" className="font-heading text-2xl text-foreground mb-2">
              More Stops in {stateName}
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              Keep the wheels turning with a few more Mother Road stops worth folding into the same stretch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nearbyStops.map((item) => (
              <Link
                key={`${item.source_table}-${item.id}`}
                to={item.detailPath || `/attractions/${item.slug}`}
                className="bg-surface border-2 border-border rounded-sm overflow-hidden hover:border-primary transition-colors shadow-[4px_4px_0_hsl(var(--border)/0.3)]"
              >
                <img
                  src={item.image_url || fallbackImage}
                  alt={item.name}
                  className="w-full h-36 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <p className="font-special text-xs uppercase text-primary mb-2">
                    {item.category || (item.source_table === 'hidden_gems' ? 'Hidden Gem' : 'Attraction')}
                  </p>
                  <h3 className="font-heading text-lg text-foreground leading-tight mb-2">{item.name}</h3>
                  <p className="font-body text-sm text-muted-foreground mb-3">
                    {item.city_name}, {item.state}
                  </p>
                  <span className="inline-flex items-center gap-2 font-special text-xs uppercase text-primary">
                    See stop details
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-surface border-2 border-border rounded-sm p-6 shadow-[4px_4px_0_hsl(var(--primary)/0.25)] text-center">
        <p className="font-special text-xs uppercase tracking-wide text-primary mb-2">Plan Your Visit</p>
        <h2 className="font-heading text-3xl text-foreground mb-3">Ready to hit the road?</h2>
        <p className="font-body text-foreground leading-relaxed max-w-2xl mx-auto mb-6">
          Ask Big Bo anything about Route 66.
        </p>
        <button
          type="button"
          onClick={openChat}
          className="inline-flex items-center gap-2 font-special text-sm uppercase bg-primary text-primary-foreground px-8 py-3 border-2 border-primary rounded-sm shadow-[4px_4px_0_hsl(var(--primary)/0.3)] hover:bg-primary/90 transition-colors"
        >
          Open the Trip Planner Chat
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};

export default AttractionDetailSections;