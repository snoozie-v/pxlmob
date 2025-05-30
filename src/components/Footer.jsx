const Footer = () => {
  // Get the current year
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {year} PXLMob NFTs. All rights reserved. Part of the <a href="https://minomob.com/">Mino Mob</a> universe.</p>
      </div>
    </footer>
  );
};

export default Footer;
