"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Icon,
  Button,
  Text,
  Slider,
  Section,
  Container,
  SlideIn,
  FlipIn,
} from "@/ui";
import { ArrowRight, CheckCircle } from "@/ui/icons";
import { texts } from "@/constants";
import styles from "./page.module.css";
import { navigationLinks } from "@/constants/navigation";
import { ContactForm, Hero } from "@/components";
import clsx from "clsx";

export default function HomePage() {
  const { paintlessDentSection, autoHailRepairSection, courseSection } = texts;

  return (
    <>
      <Section id="section-pdr-course">
        <Container>
          <div className={styles.courseWrapper}>
            <div>
              <div className={styles.contentRow}>
                <div className={styles.leftColumn}>
                  <Text
                    as="h2"
                    className={styles.title}
                    weight="bold"
                    animate="words"
                    trigger="scroll"
                  >
                    {courseSection.title}
                  </Text>

                  <SlideIn from="left" trigger="scroll">
                    <ul className={styles.list}>
                      {[
                        courseSection.listTwo.list_textOne,
                        courseSection.listTwo.list_textThree,
                        courseSection.listTwo.list_textFour,
                      ].map((item, i) => (
                        <li key={i} className={styles.listItem}>
                          <Icon
                            as={CheckCircle}
                            size="sm"
                            strokeWidth={2}
                            className={styles.icon}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={clsx(styles.ctaRow, styles.spacingTop)}>
                      <Link href={navigationLinks.pdrCourse}>
                        <Button
                          icon={<Icon as={ArrowRight} />}
                          variant="secondary"
                          style={{ "--delay": "120ms" }}
                        >
                          {texts.default.button_link_title}
                        </Button>
                      </Link>
                    </div>
                  </SlideIn>
                </div>

                <div className={styles.logoWrapper}>
                  <SlideIn from="right" trigger="scroll">
                    <Image
                      src="/pdr-course-logo.jpg"
                      alt="PDR Course Logo"
                      width={400}
                      height={400}
                      className={styles.logo}
                      priority
                    />
                  </SlideIn>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Hero />

      <Section id="section-auto-hail-repair">
        <Container>
          <Text
            as="h2"
            className={styles.title}
            weight="bold"
            animate="words"
            trigger="scroll"
          >
            {autoHailRepairSection.title}
          </Text>

          <div className={styles.content}>
            <div className={`${styles.contentRow} ${styles.reverse}`}>
              <div className={styles.leftColumn}>
                <SlideIn from="right" trigger="scroll">
                  <Text
                    as="p"
                    className={`${styles.lede} ${styles.measure}`}
                    weight="medium"
                  >
                    {autoHailRepairSection.paragraphOne}
                  </Text>
                  <Text as="p" className={styles.measure}>
                    {autoHailRepairSection.paragraphTwo}
                  </Text>
                </SlideIn>

                <SlideIn from="right" trigger="scroll">
                  <div className={styles.ctaRow}>
                    <Link href={navigationLinks.autoHailRepair}>
                      <Button
                        icon={<Icon as={ArrowRight} />}
                        variant="secondary"
                      >
                        {texts.default.button_link_title}
                      </Button>
                    </Link>
                  </div>
                </SlideIn>
              </div>

              <div className={styles.rightColumn}>
                <SlideIn from="left" trigger="scroll">
                  <Slider
                    before="/autoHailRepair-before.jpg"
                    after="/autoHailRepair-after.jpg"
                    altBefore="Roof and hood with hail dents"
                    altAfter="Panels restored after hail repair"
                  />
                </SlideIn>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="section-paintless-dent-repair">
        <Container>
          <Text
            as="h2"
            className={styles.title}
            weight="bold"
            animate="words"
            trigger="scroll"
          >
            {paintlessDentSection.title}
          </Text>

          <div className={styles.content}>
            <div className={styles.contentRow}>
              <div className={styles.leftColumn}>
                <SlideIn from="left" trigger="scroll">
                  <Text
                    as="p"
                    className={`${styles.lede} ${styles.measure}`}
                    weight="medium"
                  >
                    {paintlessDentSection.paragraphOne}
                  </Text>
                  <Text as="p" className={styles.measure}>
                    {paintlessDentSection.paragraphTwo}
                  </Text>
                </SlideIn>

                <SlideIn from="left" trigger="scroll">
                  <div className={styles.ctaRow}>
                    <Link href={navigationLinks.paintlessDent}>
                      <Button
                        icon={<Icon as={ArrowRight} />}
                        variant="secondary"
                      >
                        {texts.default.button_link_title}
                      </Button>
                    </Link>
                  </div>
                </SlideIn>
              </div>

              <div className={clsx(styles.rightColumn, styles.reversed)}>
                <SlideIn from="right" trigger="scroll">
                  <Slider
                    before="/paintlessDentRepair-before.jpg"
                    after="/paintlessDentRepair-after.jpg"
                    altBefore="Door dent before repair"
                    altAfter="Door panel after paintless dent repair—like new"
                  />
                </SlideIn>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="section-contact-us">
        <Container>
          <div className={styles.contactSection}>
            <Text
              as="h2"
              weight="bold"
              className={styles.contactTitle}
              animate="words"
            >
              Contact Us
            </Text>

            <Text
              as="p"
              color="secondary"
              className={styles.contactSubtitle}
              animate="words"
            >
              Prefer a quick call or message? Reach out directly — we’ll get
              back fast.
            </Text>

            <SlideIn from="right" trigger="scroll">
              <div className={styles.contactGrid}>
                <a
                  href="tel:+17204194566"
                  className={styles.contactCard}
                  aria-label="Call or text +1 720 419 4566"
                >
                  <div className={styles.contactIcon} aria-hidden="true">
                    📞
                  </div>
                  <div className={styles.contactInfo}>
                    <Text as="p" weight="bold">
                      Call or Text
                    </Text>
                    <Text as="p" className={styles.contactValue}>
                      +1 (720)419-4566
                    </Text>
                  </div>
                </a>

                <a
                  href="mailto:autopdraces@gmail.com"
                  className={styles.contactCard}
                  aria-label="Send email to autopdraces@gmail.com"
                >
                  <div className={styles.contactIcon} aria-hidden="true">
                    ✉️
                  </div>
                  <div className={styles.contactInfo}>
                    <Text as="p" weight="bold">
                      Email
                    </Text>
                    <Text as="p" className={styles.contactValue}>
                      autopdraces@gmail.com
                    </Text>
                  </div>
                </a>

                <a
                  href="https://m.me/justnick19"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactCard}
                  aria-label="Chat via Facebook Messenger"
                >
                  <div className={styles.contactIcon} aria-hidden="true">
                    💬
                  </div>
                  <div className={styles.contactInfo}>
                    <Text as="p" weight="bold">
                      Messenger
                    </Text>
                    <Text as="p" className={styles.contactValue}>
                      Message Nick
                    </Text>
                  </div>
                </a>
              </div>
            </SlideIn>
          </div>
        </Container>
      </Section>

      <Section id="section-contact">
        <Container>
          <FlipIn direction="top" trigger="scroll">
            <ContactForm type="default" />
          </FlipIn>
        </Container>
      </Section>
    </>
  );
}
