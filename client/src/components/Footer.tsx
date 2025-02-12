import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      <p>&copy; {new Date().getFullYear()} Digivault. All Rights Reserved</p>
      <div className="footer__links">
        {["About", "Privacy Policy", "Licensing", "Contact"].map((link) => (
          <Link
            key={link}
            href={`/${link.toLocaleLowerCase().replace(/ /g, "-")}`}
            className="footer__link"
          >
            {link}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
