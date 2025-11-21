"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface CampaignMembershipContextType {
  isMember: boolean; // This might be deprecated if we fetch real status, but kept for now
  joinCampaign: () => void;
  memberName: string;
  setMemberName: (name: string) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const CampaignMembershipContext = createContext<CampaignMembershipContextType | undefined>(undefined);

export const CampaignMembershipProvider = ({ children }: { children: ReactNode }) => {
  const [isMember, setIsMember] = useState(false);
  const [memberName, setMemberNameState] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for auth token in cookies
    const token = Cookies.get('access');
    setIsLoggedIn(!!token);

    // Legacy mock data check - can be removed later if fully API driven
    const storedIsMember = localStorage.getItem('isCampaignMember');
    const storedMemberName = localStorage.getItem('campaignMemberName');
    if (storedIsMember === 'true') {
      setIsMember(true);
      setMemberNameState(storedMemberName || '');
    }
  }, []);

  const joinCampaign = () => {
    localStorage.setItem('isCampaignMember', 'true');
    setIsMember(true);
  };

  const setMemberName = (name: string) => {
    localStorage.setItem('campaignMemberName', name);
    setMemberNameState(name);
  };

  const logout = () => {
    Cookies.remove('access');
    Cookies.remove('refresh');
    setIsLoggedIn(false);
    setIsMember(false);
    localStorage.removeItem('isCampaignMember');
    localStorage.removeItem('campaignMemberName');
    // Additional cleanup if needed
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <CampaignMembershipContext.Provider value={{
      isMember,
      joinCampaign,
      memberName,
      setMemberName,
      isLoggedIn,
      logout
    }}>
      {children}
    </CampaignMembershipContext.Provider>
  );
};

export const useCampaignMembership = () => {
  const context = useContext(CampaignMembershipContext);
  if (context === undefined) {
    throw new Error('useCampaignMembership must be used within a CampaignMembershipProvider');
  }
  return context;
};
