"use client";

import { useState, type FormEvent } from "react";
import { productSubmissionSchema, z } from "@/lib/validations";
import type {
  ProductSubmissionCategory,
  ProductSubmissionFieldErrors,
} from "@/types";

type ProductSubmissionFormProps = {
  categories: ProductSubmissionCategory[];
  categoriesUnavailable: boolean;
  initialValues?: Partial<FormValues>;
};

type FormValues = {
  name: string;
  websiteUrl: string;
  categoryId: string;
  description: string;
  logoUrl: string;
  ownerEmail: string;
  makerName: string;
  twitterHandle: string;
  githubUrl: string;
  discordUrl: string;
};

const initialValues: FormValues = {
  name: "",
  websiteUrl: "",
  categoryId: "",
  description: "",
  logoUrl: "",
  ownerEmail: "",
  makerName: "",
  twitterHandle: "",
  githubUrl: "",
  discordUrl: "",
};

type SubmissionResponse = {
  error?: string;
  fieldErrors?: ProductSubmissionFieldErrors;
};

function getFieldErrors(values: FormValues) {
  const result = productSubmissionSchema.safeParse(values);

  return result.success
    ? {}
    : (z.flattenError(result.error).fieldErrors as ProductSubmissionFieldErrors);
}

export function ProductSubmissionForm({
  categories,
  categoriesUnavailable,
  initialValues: prefilledValues,
}: ProductSubmissionFormProps) {
  const [values, setValues] = useState<FormValues>({ ...initialValues, ...prefilledValues });
  const [fieldErrors, setFieldErrors] = useState<ProductSubmissionFieldErrors>({});
  const [formError, setFormError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const errors = getFieldErrors(values);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormError(undefined);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as SubmissionResponse;

      if (!response.ok) {
        setFieldErrors(payload.fieldErrors ?? {});
        setFormError(payload.error ?? "Unable to submit the product right now.");
        return;
      }

      setIsSubmitted(true);
      setValues(initialValues);
      setFieldErrors({});
    } catch {
      setFormError("Unable to submit the product right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-5 rounded-2xl text-sm leading-6 text-[var(--text-primary)]">
        <h3 className="font-bold text-base text-emerald-600 dark:text-emerald-400 mb-1">Product Verified & Live!</h3>
        <p className="text-[var(--text-secondary)]">
          Your product is immediately verified and active on the public leaderboard. You can now back and outrank other products with confirmed support.
        </p>
      </div>
    );
  }

  if (categoriesUnavailable) {
    return (
      <p className="max-w-2xl border border-[var(--accent)]/30 px-4 py-3 rounded-xl text-sm leading-6 text-[var(--text-secondary)]">
        Product submissions are temporarily unavailable. Please try again later.
      </p>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="max-w-2xl border border-[var(--accent)]/30 px-4 py-3 rounded-xl text-sm leading-6 text-[var(--text-secondary)]">
        There are no active categories available for submission yet.
      </p>
    );
  }

  return (
    <form className="max-w-2xl space-y-6" noValidate onSubmit={handleSubmit}>
      <div className="border-b border-[var(--border)] pb-3">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Product Information</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Enter your product details to claim a spot on the leaderboard.
        </p>
      </div>

      <FormField label="Product Name *" error={fieldErrors.name?.[0]}>
        <input
          autoComplete="organization"
          placeholder="e.g. Acme Studio"
          onChange={(event) => updateField("name", event.target.value)}
          value={values.name}
          {...inputProps("name")}
        />
      </FormField>

      <FormField label="Website URL *" error={fieldErrors.websiteUrl?.[0]}>
        <input
          autoComplete="url"
          inputMode="url"
          onChange={(event) => updateField("websiteUrl", event.target.value)}
          placeholder="https://example.com"
          type="url"
          value={values.websiteUrl}
          {...inputProps("websiteUrl")}
        />
      </FormField>

      <FormField label="Category *" error={fieldErrors.categoryId?.[0]}>
        <select
          onChange={(event) => updateField("categoryId", event.target.value)}
          value={values.categoryId}
          {...inputProps("categoryId")}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Short Description *" error={fieldErrors.description?.[0]}>
        <textarea
          onChange={(event) => updateField("description", event.target.value)}
          rows={3}
          placeholder="A concise description of what your product does (10 to 500 characters)."
          value={values.description}
          {...inputProps("description")}
        />
      </FormField>

      <FormField label="Logo URL (optional)" error={fieldErrors.logoUrl?.[0]}>
        <input
          inputMode="url"
          onChange={(event) => updateField("logoUrl", event.target.value)}
          placeholder="https://example.com/logo.png"
          type="url"
          value={values.logoUrl}
          {...inputProps("logoUrl")}
        />
      </FormField>

      <FormField label="Contact Email *" error={fieldErrors.ownerEmail?.[0]}>
        <input
          autoComplete="email"
          onChange={(event) => updateField("ownerEmail", event.target.value)}
          placeholder="maker@example.com"
          type="email"
          value={values.ownerEmail}
          {...inputProps("ownerEmail")}
        />
      </FormField>

      {/* Social Media Platforms & Maker Section */}
      <div className="border-t border-[var(--border)] pt-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Maker & Social Media Platforms</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Link your social profiles to show verification and let supporters connect with you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Maker Name (optional)" error={fieldErrors.makerName?.[0]}>
            <input
              placeholder="e.g. Alex Rivera"
              onChange={(event) => updateField("makerName", event.target.value)}
              value={values.makerName}
              {...inputProps("makerName")}
            />
          </FormField>

          <FormField label="Twitter / X Handle (optional)" error={fieldErrors.twitterHandle?.[0]}>
            <input
              placeholder="@handle or handle"
              onChange={(event) => updateField("twitterHandle", event.target.value)}
              value={values.twitterHandle}
              {...inputProps("twitterHandle")}
            />
          </FormField>

          <FormField label="GitHub Repository / Profile (optional)" error={fieldErrors.githubUrl?.[0]}>
            <input
              placeholder="https://github.com/maker/repo"
              onChange={(event) => updateField("githubUrl", event.target.value)}
              value={values.githubUrl}
              {...inputProps("githubUrl")}
            />
          </FormField>

          <FormField label="Discord Server / Handle (optional)" error={fieldErrors.discordUrl?.[0]}>
            <input
              placeholder="https://discord.gg/invite"
              onChange={(event) => updateField("discordUrl", event.target.value)}
              value={values.discordUrl}
              {...inputProps("discordUrl")}
            />
          </FormField>
        </div>
      </div>

      {formError ? <p className="text-sm text-[#ffb4a8]">{formError}</p> : null}

      <button
        className="inline-flex h-11 items-center justify-center bg-[#7446d8] hover:bg-[#5e34bd] px-6 text-sm font-bold text-white rounded-xl shadow-lg shadow-[#7446d8]/20 transition-all disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Submitting..." : "Submit Product for Moderation"}
      </button>
    </form>
  );
}

function inputProps(field: keyof FormValues) {
  return {
    "aria-describedby": `${field}-error`,
    className:
      "mt-1 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]",
    id: field,
    name: field,
  };
}

type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function FormField({ label, error, children }: FormFieldProps) {
  const fieldName = (children as React.ReactElement<{ id: string }>).props.id;

  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--text-primary)]" htmlFor={fieldName}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-[#ffb4a8]" id={`${fieldName}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
