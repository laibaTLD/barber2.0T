'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect, useRef } from 'react';
import type { Page } from '@/app/lib/types';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { getPageHref } from '@/app/lib/siteContent';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import { cn } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

interface FAQSectionProps {
  faqSection?: Page['faqSection'];
  className?: string;
}

type FaqItem = { question: string; answer: string };

export function FAQSection({ faqSection, className }: FAQSectionProps) {
  const { colors, fonts, styles } = useSectionTheme();
  const { pages } = useWebBuilder();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const title = useMemo(
    () => tiptapToText(faqSection?.title) || 'Frequently asked questions',
    [faqSection?.title]
  );
  const description = useMemo(
    () => tiptapToText(faqSection?.description),
    [faqSection?.description]
  );
  const questions = useMemo<FaqItem[]>(() => {
    return (
      faqSection?.items
        ?.map((item) => {
          const question = tiptapToText(item.question);
          const answer = tiptapToText(item.answer);
          if (!question && !answer) return null;
          return { question: question || 'Question', answer: answer || '' };
        })
        .filter((item): item is FaqItem => Boolean(item)) ?? []
    );
  }, [faqSection?.items]);

  const contactHref = useMemo(() => {
    const contactPage = pages?.find((p) => p.pageType === 'contact');
    return contactPage ? getPageHref(contactPage) : '/contact-us';
  }, [pages]);

  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLHeadingElement>({
    threshold: 0.3,
  });
  const { ref: descriptionRef, isVisible: descriptionVisible } =
    useScrollAnimation<HTMLParagraphElement>({ threshold: 0.3 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!faqSection || faqSection.enabled === false) return null;
  if (!title && !description && questions.length === 0) return null;

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItemBorder = {
    borderColor: 'color-mix(in srgb, var(--wb-text-main) 14%, transparent)',
  } as React.CSSProperties;

  return (
    <section
      ref={sectionRef}
      className={cn('py-16 md:py-20', className)}
      style={{ backgroundColor: colors.pageBackground, fontFamily: fonts.body }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2
              ref={titleRef}
              className={cn(
                'mb-6 text-3xl font-semibold wb-text-on-light transition-all md:text-4xl',
                isLoaded && titleVisible ? 'opacity-100' : 'opacity-0'
              )}
              style={{ fontFamily: fonts.heading }}
            >
              {title}
            </h2>
            {description && (
              <p
                ref={descriptionRef}
                className={cn(
                  'mb-8 max-w-2xl wb-text-on-light-secondary transition-all',
                  isLoaded && descriptionVisible ? 'opacity-100' : 'opacity-0'
                )}
              >
                {description}
              </p>
            )}

            <div className="space-y-3">
              {questions.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg border"
                  style={{ ...styles.cardSolid, ...faqItemBorder }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    onClick={() => toggleQuestion(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="pr-6">
                      <div className="text-[15px] font-medium wb-text-on-light">{faq.question}</div>
                      {openIndex === index && faq.answer && (
                        <p
                          id={`faq-answer-${index}`}
                          className="mt-2 text-sm wb-text-on-light-secondary"
                        >
                          {faq.answer}
                        </p>
                      )}
                    </div>
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-sm border wb-text-on-light"
                      style={{
                        borderColor: 'color-mix(in srgb, var(--wb-text-main) 22%, transparent)',
                      }}
                    >
                      <svg
                        className={`h-3.5 w-3.5 transition-transform ${
                          openIndex === index ? 'rotate-45' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <aside
            className="h-max rounded-lg border p-6"
            style={{ ...styles.cardSolid, ...faqItemBorder }}
          >
            <div className="h-10 w-10 rounded-sm" style={styles.iconBadge} />
            <h3 className="mt-4 text-base font-semibold wb-text-on-light" style={{ fontFamily: fonts.heading }}>
              Do you have more questions?
            </h3>
            <p className="mt-2 text-sm wb-text-on-light-secondary">
              Write us and we&apos;ll provide fast support and the right guidance to resolve
              issues.
            </p>
            <Link
              href={contactHref}
              className="mt-4 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
              style={styles.primaryCta}
            >
              Shoot a Direct Mail
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
