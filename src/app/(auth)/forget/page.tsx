"use client";

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
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth";
import { isAPIError } from "better-auth/api";
import { SendHorizonal } from "lucide-react";
import Link from "next/link";

export default function Forget() {
  return (
    <div className="flex justify-center">
      <Card className="sm:max-w-75 flex-1">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <form className="flex flex-col gap-2">
            <Field>
              <FieldLabel htmlFor="input-field-username-email">
                Email or Username
              </FieldLabel>
              <Input id="input-field-username-email" />
              <FieldDescription></FieldDescription>
            </Field>
            <Button type="submit">
              <span className="capitalize">send recovery email</span>
              <SendHorizonal />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="font-bold uppercase">
              sign in
            </Link>
            <Separator orientation="vertical"></Separator>
            <Link href="/sign-up" className="font-bold uppercase">
              sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
