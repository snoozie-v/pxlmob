import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationMenu: React.FC = () => {
  const navigate = useNavigate();

  // Navigation functions for each menu item
  const navigateToHome = () => navigate('/');
  const navigateToToken = () => navigate('/token');
  const navigateToRoadmap = () => navigate('/roadmap');

  return (
    <div className="navigation-menu">
      <h2>Menu</h2>
      <ul>
        <li onClick={navigateToHome}>PXLMob NFTs</li>
        <li onClick={navigateToToken}>$PIX Token</li>
        <li onClick={navigateToRoadmap}>Roadmap</li>
      </ul>
    </div>
  );
};

export default NavigationMenu;