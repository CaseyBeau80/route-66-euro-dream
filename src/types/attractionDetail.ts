export type AttractionSourceTable = 'attractions' | 'hidden_gems' | 'native_american_sites' | 'drive_ins';

export interface AttractionData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city_name: string;
  state: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
  website: string | null;
  category: string | null;
  category_canonical?: string | null;
  tags: string[];
  featured: boolean;
  admission_fee?: string | null;
  hours_of_operation?: string | null;
  year_opened?: number | null;
  tribe_nation?: string | null;
  site_type?: string | null;
  source_table: AttractionSourceTable;
  detailPath?: string;
}

export const getAttractionDetailPath = (sourceTable: AttractionSourceTable, slug: string) => {
  if (sourceTable === 'hidden_gems') return `/hidden-gems/${slug}`;
  if (sourceTable === 'native_american_sites') return `/native-heritage/${slug}`;
  return `/attractions/${slug}`;
};