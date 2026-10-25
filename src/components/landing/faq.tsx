"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Container from "@/components/common/container";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import {
  springTransition,
  fadeInUp,
  staggerContainer,
  accordionContentVariants,
} from "@/components/common/motion-style";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is clipath really 100% free to use?",
    answer:
      "Yes! clipath is completely free with no subscriptions, paid tiers, or credit card requirements. You can shorten unlimited links, customize aliases, and generate high-resolution QR codes without paying anything.",
    category: "General",
  },
  {
    question: "How do I generate a dynamic QR code from my link?",
    answer:
      "Simply paste your destination URL into the generator, choose an optional custom alias, and click 'Generate QR'. A crisp vector QR code will be generated immediately for you to download, test, and use on prints or packaging.",
    category: "QR Codes",
  },
  {
    question: "Can I customize the text/alias of my shortened link?",
    answer:
      "Absolutely. Rather than messy random characters, you can specify your own custom branded back-half (e.g., shrink.it/summer-sale or shrink.it/my-portfolio) to build brand credibility and increase click-through rates.",
    category: "Short Links",
  },
  {
    question: "What kind of analytics will be tracked on my links?",
    answer:
      "We are actively rolling out real-time click tracking, mobile vs. desktop device share, geographic heatmaps by country, and referrer sources so you can measure link engagement accurately.",
    category: "Analytics",
  },
  {
    question: "Do my links or QR codes ever expire?",
    answer:
      "Never. Links and QR codes generated on clipath remain active permanently. You can confidently print them on packaging, flyers, business cards, and billboards without fear of link breakage.",
    category: "Reliability",
  },
  {
    question: "Can I add retargeting pixels (Meta, TikTok, Pinterest)?",
    answer:
      "Yes, clipath is built with marketing pixel retargeting in mind. You will be able to attach your Meta, TikTok, and Pinterest tracking pixels to any URL, turning external traffic into owned remarketing pools.",
    category: "Growth",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-16 sm:py-24 overflow-hidden">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer(0.08, 0.05)}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center space-y-4 mb-10 sm:mb-14">
            <motion.div variants={fadeInUp} className="inline-block">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111C08] dark:bg-[#1C2612] border border-[#233512] dark:border-[#2f4618] text-[#D8F85D] text-xs font-semibold tracking-wider uppercase shadow-xs">
                <HelpCircle className="w-3.5 h-3.5 text-[#D8F85D]" />
                <span>Frequently Asked Questions</span>
              </div>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50"
            >
              Everything You Need to Know
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-xl mx-auto"
            >
              Got questions about our free link shortener, custom aliases, or
              dynamic QR codes? Here are answers to the most common queries.
            </motion.p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`rounded-2xl border transition-colors overflow-hidden ${
                    isOpen
                      ? "border-stone-400/80 dark:border-stone-700 bg-white dark:bg-[#141513] shadow-md"
                      : "border-dashed border-stone-300/80 dark:border-stone-800 bg-white/70 dark:bg-[#121311]/70 hover:border-stone-400 dark:hover:border-stone-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-semibold">
                        {faq.category}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">
                        {faq.question}
                      </span>
                    </div>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={springTransition}
                      className="p-1 rounded-full text-stone-400 dark:text-stone-500 shrink-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={accordionContentVariants}
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/80">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default FAQ;
