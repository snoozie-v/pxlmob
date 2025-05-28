import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationMenu: React.FC = () => {
  const navigate = useNavigate();

  // Navigation functions for each menu item
  const navigateToHome = () => navigate('/');
  const navigateToToken = () => navigate('/token');
  const navigateToRoadmap = () => navigate('/roadmap');
  const navigateToLottery = () => navigate('/lottery');

  return (
    <div className="navigation-menu">
      <h2>Menu</h2>
      <ul>
        <li onClick={navigateToHome}>PXLMob NFTs</li>
        <li onClick={navigateToToken}>$PiX Token</li>
        <li onClick={navigateToRoadmap}>Roadmap</li>
        <li onClick={navigateToLottery}>Lottery</li>
      </ul>
    </div>
  );
};

export default NavigationMenu;
