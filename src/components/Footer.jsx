

const Footer = () => {
  // Get the current year
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {year} PXLMob NFTs. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;