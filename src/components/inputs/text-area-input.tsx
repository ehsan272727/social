"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";

interface Props<T extends FieldValues> {
  formControl: Control<T, unknown, unknown>;
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  isRequired?: boolean;
  resizeable?: boolean;
}

export function TextareaInput<T extends FieldValues>({
  formControl,
  name,
  label,
  description,
  placeholder,
  isRequired = false,
  resizeable = false,
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
          <Textarea
            {...field}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder ? placeholder : ""}
            className={clsx("", resizeable ? "resize" : "resize-none")}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
