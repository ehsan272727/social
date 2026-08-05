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
import { Eye, EyeOff, LogIn } from "lucide-react";
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
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <form className="flex flex-col gap-2">
            <Field>
              <FieldLabel htmlFor="input-username-email">
                Email Or Username
              </FieldLabel>
              <Input id="inpu-username-email" />
              <FieldDescription></FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="input-password">Password</FieldLabel>
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
            <Button className="py-5">
              <span>Sign in</span>
              <LogIn />
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
          <Link href="/forget" className="font-bold hover:underline">
            Forgot password ?
          </Link>
          <p className="flex gap-1">
            <span>Don&apos;t have an account?</span>
            <Link href="/sign-up" className="font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
