'use client';

import React from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Phone, Mail, ArrowUpRight, MapPin, Globe } from "lucide-react";

import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/Loading';
import { useGetPublicCampaignDetail } from '@/services/campaigns/hook';

const formatFallback = (primary?: string | null, secondary?: string | null, fallback: string = 'Not available') => {
  if (primary && primary.trim()) return primary;
  if (secondary && secondary.trim()) return secondary;
  return fallback;
};

const buildLink = (type: 'tel' | 'mailto' | 'url', value?: string | null) => {
  if (!value) return undefined;
  if (type === 'url') return value.startsWith('http') ? value : `https://${value}`;
  return `${type}:${value}`;
};

export default function ContactUsPage() {
  const params = useParams();
  const campaignId = params.campaignId as string | undefined;
  const { data, isLoading, isError, refetch } = useGetPublicCampaignDetail(campaignId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4 px-4 bg-gray-50">
        <p className="text-red-500 font-medium">Error loading contact info.</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const contactPhone = formatFallback(data.contactPhoneNumber, data.business?.phone, 'Phone not provided');
  const contactEmail = formatFallback(data.contactEmail, data.business?.email, 'Email not provided');
  const contactAddress = formatFallback(undefined, data.business?.address, 'Address not provided');
  const website = data.business?.website;

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      contact: contactPhone,
      link: buildLink('tel', data.contactPhoneNumber || data.business?.phone),
    },
    {
      icon: Mail,
      title: 'Email Us',
      contact: contactEmail,
      link: buildLink('mailto', data.contactEmail || data.business?.email),
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      contact: contactAddress,
      link: undefined,
    },
    {
      icon: Globe,
      title: 'Website',
      contact: website || 'Website not provided',
      link: website ? buildLink('url', website) : undefined,
    },
  ].filter((method) => method.contact && method.contact !== '');

  const pageTitle = data.contactUsPageTitle || `Contact ${data.business?.name || 'Us'}`;
  const pageDescription =
    data.contactUsPageDescription ||
    'Need help with this campaign? Reach out to the team using any of the options below.';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
          <p className="text-lg text-gray-600">{pageDescription}</p>
        </div>

        <div className="space-y-8">
          {contactMethods.map((method, index) => {
            const content = (
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:border-orange-600 border-2 border-transparent">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="bg-orange-600 text-white p-4 rounded-full">
                      <method.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-800">{method.title}</CardTitle>
                      <p className="text-lg text-gray-600">{method.contact}</p>
                    </div>
                  </div>
                  {method.link && (
                    <ArrowUpRight className="h-8 w-8 text-gray-400 group-hover:text-orange-600 transition-colors duration-300" />
                  )}
                </CardContent>
              </Card>
            );

            return method.link ? (
              <a href={method.link} key={index} target={method.link.startsWith('http') ? '_blank' : '_self'} className="block group">
                {content}
              </a>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
