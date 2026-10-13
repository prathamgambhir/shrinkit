import Container from "@/components/common/container";
import Hero from "@/components/landing/hero";
import React from "react";

export default function Home() {
  return (
    <Container className="flex flex-col flex-1">
      <Hero />
    </Container>
  );
}
