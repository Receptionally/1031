import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Contact() {
  return (
    <div id="contact" className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Contact</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Get in Touch
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Have questions about our firewood? We're here to help!
          </p>
        </div>
        <div className="mt-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-orange-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Phone</h3>
              <p className="mt-2 text-base text-gray-500">(555) 123-4567</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 text-orange-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Email</h3>
              <p className="mt-2 text-base text-gray-500">sales@woodheat.com</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-orange-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Location</h3>
              <p className="mt-2 text-base text-gray-500">123 Forest Road</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}