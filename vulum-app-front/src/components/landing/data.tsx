// Landing Page Data
// Contains all static data for the landing page sections

import { ReactNode } from "react";
import {
  ShieldIcon,
  RocketIcon,
  GlobeIcon,
  ChartIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  DownloadIcon,
} from "./icons";

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface Step {
  icon: ReactNode;
  step: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

// Navigation Links
export const navLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "/pricing", isExternal: false },
];

// Features Data
export const features: Feature[] = [
  {
    icon: <ShieldIcon />,
    title: "Secure Transactions",
    description:
      "Every transaction is protected with bank-level security. Your digital products and payments are always safe.",
  },
  {
    icon: <RocketIcon />,
    title: "Instant Delivery",
    description:
      "Get immediate access to your purchased digital products. No waiting, no delays—just instant gratification.",
  },
  {
    icon: <GlobeIcon />,
    title: "Global Marketplace",
    description:
      "Connect with creators and buyers worldwide. Sell your digital products to customers across the globe.",
  },
  {
    icon: <ChartIcon />,
    title: "Analytics Dashboard",
    description:
      "Track your sales, revenue, and customer insights with our powerful analytics tools built for creators.",
  },
];

// How It Works Steps
export const steps: Step[] = [
  {
    icon: <ShoppingBagIcon />,
    step: "01",
    title: "Browse Products",
    description:
      "Explore thousands of digital products from talented creators worldwide.",
  },
  {
    icon: <CreditCardIcon />,
    step: "02",
    title: "Secure Checkout",
    description:
      "Complete your purchase with our secure, hassle-free payment system.",
  },
  {
    icon: <DownloadIcon />,
    step: "03",
    title: "Instant Access",
    description:
      "Download and access your digital products immediately after purchase.",
  },
];

// Testimonials Data
export const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Digital Creator",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "Vulum transformed my business. I've sold over 500 digital templates and the platform makes everything so easy!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content:
      "The best marketplace for digital products. Clean interface, fast payments, and amazing support team.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Content Creator",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    content:
      "I love how simple it is to upload and sell my courses. Vulum handles everything so I can focus on creating.",
    rating: 5,
  },
];

// Footer Links
export const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Integrations", href: "#" },
      { label: "API", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

// Hero Section Stats (Dashboard Preview)
export const dashboardStats = [
  {
    label: "Total Revenue",
    value: "$24,580",
    change: "↑ 12% this month",
  },
  {
    label: "Products Sold",
    value: "1,247",
    change: "↑ 8% this month",
  },
  {
    label: "Active Customers",
    value: "892",
    change: "↑ 24% this month",
  },
  {
    label: "Conversion Rate",
    value: "4.8%",
    change: "↑ 2% this month",
  },
];

// Trust Badges
export const trustBadges = [
  "No credit card required",
  "Free forever plan",
  "Cancel anytime",
];
