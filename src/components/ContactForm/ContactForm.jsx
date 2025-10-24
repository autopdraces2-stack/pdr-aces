"use client";
import styles from "./ContactForm.module.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactSchema } from "@/schemas";
import { texts } from "@/constants";
import { Button, Input, Textarea, Label, Text, PhoneInput } from "@/ui";
import { useState } from "react";

export default function ContactForm({
  title,
  description,
  descriptionLabel = "",
  descriptionPlaceholder = "",
  buttonText = "",
  type = "default", // 'default" | "course"
}) {
  const [isSuccessful, setIsSuccessful] = useState(false);
  const t = texts.contact;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone: "", description: "" },
  });

  const onSubmit = async ({ name, email, phone, description }) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        description,
        type,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error:", data);
      setIsSuccessful(false);
      alert("Failed to send request");
      return;
    }

    setIsSuccessful(true);
    reset();
  };

  return (
    <div className={styles.wrapper}>
      <Text as="h2" weight="bold" className={styles.wrapper__title}>
        {title || t.title}
      </Text>
      <Text as="p" color="secondary" className={styles.wrapper__description}>
        {description || t.description}
      </Text>

      {isSuccessful ? (
        <span className={styles.successText} role="status">
          {t.successText}
        </span>
      ) : (
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <fieldset className={styles.fieldset}>
            <div className={styles.field}>
              <Label htmlFor="name" required>
                {t.nameLabel}
              </Label>
              <Input
                id="name"
                placeholder={t.namePlaceholder}
                autoComplete="name"
                aria-invalid={!!errors.name || undefined}
                {...register("name")}
                error={errors.name?.message}
              />
              {errors.name && (
                <p className={styles.errorText} role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor="phone" required>
                {t.phoneLabel}
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <PhoneInput
                    id="phone"
                    value={value}
                    onChange={onChange}
                    defaultCountry="us"
                    placeholder={t.phonePlaceholder}
                    error={errors.phone?.message}
                    ref={ref}
                  />
                )}
              />
              {errors.phone && (
                <p className={styles.errorText} role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                autoComplete="email"
                aria-invalid={!!errors.email || undefined}
                {...register("email")}
                error={errors.email?.message}
              />
              {errors.email && (
                <p className={styles.errorText} role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
          </fieldset>

          <div className={styles.field}>
            <Label htmlFor="description">
              {descriptionLabel || t.descriptionLabel}
            </Label>
            <Textarea
              id="description"
              placeholder={descriptionPlaceholder || t.descriptionPlaceholder}
              rows={5}
              {...register("description")}
              className={styles.textarea}
            />
            {errors.description && (
              <p className={styles.errorText} role="alert">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={styles.actions__submit}
            >
              {isSubmitting ? t.buttonSubmitting : buttonText || t.buttonText}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
