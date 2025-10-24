import Image from "next/image";
import { ContactForm } from "@/components";
import { Section, Container, Text, SlideIn, FlipIn } from "@/ui";
import { texts } from "@/constants";
import styles from "./page.module.css";

export default function PDRCoursePage() {
  const tContact = texts.contact;
  const tCourse = texts.contact;

  return (
    <Section id="section-contact">
      <Container>
        <Text as="h2" className={styles.title} weight="bold" animate="words">
          {texts.courseSection.title}
        </Text>

        <div className={styles.stack}>
          <SlideIn from="left">
            <div className={styles.textBlock}>
              <Text as="p" className={styles.par}>
                {texts.courseSection.paragraphOne}
              </Text>
              <Text as="p" className={styles.par}>
                {texts.courseSection.paragraphTwo}
              </Text>
              <Text as="p" className={styles.par}>
                {texts.courseSection.paragraphThree}
              </Text>
            </div>
          </SlideIn>

          <SlideIn from="right">
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

        <FlipIn direction="top" trigger="scroll">
          <ContactForm
            type="course"
            title={tContact.titleCourse}
            description={tContact.descriptionCourse}
            descriptionLabel={tContact.descriptionLabelCourse}
            descriptionPlaceholder={tContact.descriptionPlaceholderCourse}
            buttonText={tContact.buttonTextCourse}
          />
        </FlipIn>
      </Container>
    </Section>
  );
}
