import { Icon, Text, Slider, Section, Container, SlideIn } from "@/ui";
import { CheckCircle } from "@/ui/icons";
import { texts } from "@/constants";
import styles from "./page.module.css";

export default function AutoHailRepairPage() {
  const { autoHailRepairSection } = texts;

  return (
    <Section>
      <Container>
        <Text as="h2" className={styles.title} weight="bold" animate="words">
          {autoHailRepairSection.title}
        </Text>

        <Text as="p" className={styles.par} animate="opacity">
          {autoHailRepairSection.paragraphOne}
        </Text>
        <Text as="p" className={styles.par} animate="opacity">
          {autoHailRepairSection.paragraphTwo}
        </Text>

        <div className={styles.content}>
          <div className={styles.contentRow}>
            <div className={`${styles.listBlock} ${styles.stack}`}>
              <Text as="h4" animate="words">
                {autoHailRepairSection.listOne.list_name}
              </Text>
              <SlideIn from="left">
                <ul className={styles.list}>
                  {[
                    autoHailRepairSection.listOne.list_textOne,
                    autoHailRepairSection.listOne.list_textTwo,
                    autoHailRepairSection.listOne.list_textThree,
                    autoHailRepairSection.listOne.list_textFour,
                  ].map((item, i) => (
                    <li key={i} className={styles.listItem}>
                      <Icon
                        as={CheckCircle}
                        size="sm"
                        strokeWidth={2}
                        className={styles.icon}
                      />
                      <Text as="p" animate="opacity">
                        {item}
                      </Text>
                    </li>
                  ))}
                </ul>
              </SlideIn>
            </div>

            <div className={`${styles.listBlock} ${styles.stack}`}>
              <Text as="h4" animate="words">
                {autoHailRepairSection.listTwo.list_name}
              </Text>
              <SlideIn from="right">
                <ul className={styles.list}>
                  {[
                    autoHailRepairSection.listTwo.list_textOne,
                    autoHailRepairSection.listTwo.list_textTwo,
                    autoHailRepairSection.listTwo.list_textThree,
                    autoHailRepairSection.listTwo.list_textFour,
                  ].map((item, i) => (
                    <li key={i} className={styles.listItem}>
                      <Icon
                        as={CheckCircle}
                        size="sm"
                        strokeWidth={2}
                        className={styles.icon}
                      />
                      <Text as="p" animate="opacity">
                        {item}
                      </Text>
                    </li>
                  ))}
                </ul>
              </SlideIn>
            </div>
          </div>

          <div className={styles.sliderContainer}>
            <Slider
              before="/AHRphoto1-before.jpg"
              after="/AHRphoto1-after.jpg"
              altBefore="Car dent before repair"
              altAfter="Car after paintless dent repair"
            />
            <Slider
              before="/AHRphoto2-before.jpg"
              after="/AHRphoto2-after.jpg"
              altBefore="Car dent before repair"
              altAfter="Car after paintless dent repair"
            />
            <Slider
              before="/AHRphoto3-before.jpg"
              after="/AHRphoto3-after.jpg"
              altBefore="Car dent before repair"
              altAfter="Car after paintless dent repair"
            />
            <Slider
              before="/AHRphoto4-before.jpg"
              after="/AHRphoto4-after.jpg"
              altBefore="Car dent before repair"
              altAfter="Car after paintless dent repair"
            />
            <Slider
              before="/AHRphoto5-before.jpg"
              after="/AHRphoto5-after.jpg"
              altBefore="Car dent before repair"
              altAfter="Car after paintless dent repair"
            />
                <Slider
                    before="/autoHailRepair-before.jpg"
                    after="/autoHailRepair-after.jpg"
                    altBefore="Roof and hood with hail dents"
                    altAfter="Panels restored after hail repair"
                  />
          </div>
        </div>
      </Container>
    </Section>
  );
}
