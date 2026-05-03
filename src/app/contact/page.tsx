import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact | Texas Peptides",
  description:
    "Get in touch with Texas Peptides. Product questions, custom synthesis quotes, or just say hey. Austin, TX.",
};

export default function ContactPage() {
  return <ContactContent />;
}
