// Navigation Links ka centralized data
export const NAV_LINKS = {
  mainPages: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Properties", href: "/properties" },
    { label: "Blog", href: "/blog" },
  ],
  cmsPages: [
    { label: "Properties Single", href: "/properties/[id]" },
    { label: "Blog Single", href: "/blog/[slug]" },
    { label: "Contact Us", href: "/contact" },
  ],
};

export const CONTACT_INFO = {
   phone: "011-111-1111",
  phoneHref: "tel:011-111-1111",
  email: "Contact@CompanyName.com",
  emailHref: "mailto:Contact@CompanyName.com",
};

export const BRAND = {
  name: "Company Name",
  nameLight: "Properties",
};