import SocialLinks from "@/components/SocialLinks";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#about", label: "About" },
];

export default function Nav() {
  return (
    <header className="siteHeader">
      <nav className="navInner" aria-label="Primary">
        <a href="#top" className="brand">
          <span className="brandMark" aria-hidden="true">
            MP
          </span>
          <span className="brandName">Mc-Kelly Pepple</span>
        </a>

        <ul className="navLinks">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <SocialLinks className="navSocial" />

        <a href="#contact" className="navCta">
          Get in touch
        </a>
      </nav>
    </header>
  );
}
