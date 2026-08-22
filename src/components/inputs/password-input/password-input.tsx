"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { ReactNode, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props<T extends FieldValues> {
  formControl: Control<T, unknown, unknown>;
  name: Path<T>;
  label?: string;
  description?: string | ReactNode;
  placeholder?: string;
  isRequired?: boolean;
}

export function PasswordInput<T extends FieldValues>({
  formControl,
  name,
  label,
  description,
  placeholder,
  isRequired = false,
}: Props<T>) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field>
      {label && (
        <FieldLabel htmlFor={id} className="capitalize">
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}

      {
        <Controller
          name={name}
          control={formControl}
          render={({ field, fieldState }) => (
            <>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={id}
                  aria-invalid={fieldState.invalid}
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder ? placeholder : ""}
                />
                <InputGroupAddon align="inline-end" className="pr-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </>
          )}
        />
      }

      {description}
    </Field>
  );
}
