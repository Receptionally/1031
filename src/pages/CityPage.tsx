import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { Features } from '../components/Features';
import { CityInfo } from '../components/CityInfo';
import { Products } from '../components/Products';
import { Reviews } from '../components/Reviews';
import { Footer } from '../components/Footer';

export function CityPage() {
  const { slug } = useParams();
  
  // Extract city and state from slug (e.g., "portland-or" -> ["portland", "or"])
  const [city, state] = (slug || '').split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <CityInfo city={city} state={state} />
      <Products />
      <Reviews />
      <Footer />
    </div>
  );
}