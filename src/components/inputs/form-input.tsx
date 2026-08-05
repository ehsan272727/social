"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { type ComponentProps, HTMLInputTypeAttribute, useId } from "react";

interface Props<T extends FieldValues> {
  formControl: Control<T, unknown, unknown>;
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  isRequired?: boolean;
}

export function FormInput<T extends FieldValues>({
  formControl,
  name,
  label,
  description,
  placeholder,
  type = "text",
  isRequired = false,
}: Props<T>) {
  const id = useId();

  return (
    <Controller
      name={name}
      control={formControl}
      render={({ field, fieldState }) => (
        <Field>
          {label && (
            <FieldLabel htmlFor={id} className="capitalize">
              {label}
              {isRequired && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}
          <Input
            {...field}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder ? placeholder : ""}
            type={type}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
