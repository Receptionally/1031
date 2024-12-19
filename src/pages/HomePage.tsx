import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { Features } from '../components/Features';
import { LocalInfo } from '../components/LocalInfo';
import { Products } from '../components/Products';
import { Reviews } from '../components/Reviews';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <LocalInfo />
      <Products />
      <Reviews />
      <Footer />
    </div>
  );
}