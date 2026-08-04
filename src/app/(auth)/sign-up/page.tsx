"use client";

import { GoogleButton } from "@/components/auth/googleButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { isAPIError } from "better-auth/api";
import { Eye, EyeOff, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function handleGoogleSignIn() {
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      });
      console.log(data);
    } catch (error) {
      if (isAPIError(error)) {
        return "an Error happened in sign in";
      }
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="sm:max-w-75 flex-1">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <form className="flex flex-col gap-2">
            <Field>
              <FieldLabel htmlFor="input-name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input id="input-name" />
              <FieldDescription></FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="input-email">
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input id="input-email" type="email" />
              <FieldDescription></FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="input-password">
                Password <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="input-password"
                  type={showPassword ? "text" : "password"}
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
              <FieldDescription></FieldDescription>
            </Field>
            {/* ====================== */}
            <Field>
              <FieldLabel htmlFor="input-password-confirm">
                Password Confirm <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="input-password-confirm"
                  type={showPassword ? "text" : "password"}
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
              <FieldDescription></FieldDescription>
            </Field>
            <Button className="py-5">
              <span>Sign up</span>
              <UserRoundPlus />
            </Button>
          </form>
          <div className="flex items-center gap-4">
            <Separator className="flex-1"></Separator>
            <p className="shrink-0">OR</p>
            <Separator className="flex-1"></Separator>
          </div>
          <GoogleButton handleGoogleSignIn={handleGoogleSignIn} />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="flex gap-1">
            <span>Already have an account?</span>
            <Link href="/sign-in" className="font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
