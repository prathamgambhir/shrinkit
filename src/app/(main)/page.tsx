import Container from "@/components/common/container";
import Hero from "@/components/landing/hero";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";
import React from "react";

export default function Home() {
  return (
    <Container className="flex flex-col flex-1">
      <Hero />
      <FAQ />
      <CTA />
    </Container>
  );
}
