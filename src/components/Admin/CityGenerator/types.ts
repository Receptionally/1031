export interface CityPage {
  id: string;
  city: string;
  state: string;
  slug: string;
  title: string;
  meta_description: string;
  content: string;
  custom_content?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}