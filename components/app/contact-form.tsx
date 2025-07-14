"use client";

import { MailIcon, PhoneIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { sendContactForm } from "@/lib/mail";
import { toast } from "sonner";

type ContactFormState = {
  success: boolean;
  message: string;
};

export function ContactForm() {
  const [state, formAction] = useActionState<ContactFormState, FormData>(
    sendContactForm,
    {
      success: false,
      message: "",
    }
  );

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <section className="px-8 py-16 dark:bg-[#29384e]">
      <div className="container mx-auto mb-20 text-center">
        <h1 className="text-3xl lg:text-5xl font-bold text-[#29384e] mb-4 dark:text-[#F0DBCD]">
          Contact Us
        </h1>
        <p className="text-gray-500 mx-auto w-full lg:w-5/12 dark:text-[#F0DBCD]">
          Ready to get started? Feel free to reach out through the contact form,
          and let&apos;s embark on a journey of innovation and success.
        </p>
      </div>

      <Card className="container mx-auto border dark:bg-[#232E3F]">
        <CardContent className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-7 gap-10">
          {/* Contact Info Panel */}
          <div className="col-span-3 text-[#29384e] dark:text-[#F0DBCD] rounded-lg p-6 md:p-10">
            <CardHeader className="p-0 mb-4">
              <h4 className="text-2xl font-semibold">Contact Information</h4>
            </CardHeader>
            <p className="text-gray-400 text-base mb-8">
              Fill up the form and our Team will get back to you within 24
              hours.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <PhoneIcon className="h-6 w-6" />
              <p>+266 5014 0266</p>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <MailIcon className="h-6 w-6" />
              <p>muliasaint@gmail.com</p>
            </div>
            <div className="flex gap-5">
              <Button variant="ghost" size="icon" className="text-white">
                <i className="fa-brands fa-facebook text-lg" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <i className="fa-brands fa-instagram text-lg" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <i className="fa-brands fa-github text-lg" />
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-span-4">
            <form action={formAction}>
              <div className="mb-8 grid gap-4 lg:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="eg. Lucas"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="eg. Jones"
                    required
                  />
                </div>
              </div>

              <div className="mb-8">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="eg. lucas@mail.com"
                  required
                />
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  What are you interested in?
                </p>
                <RadioGroup
                  name="interest"
                  defaultValue="collaboration"
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="collaboration" id="r1" />
                    <Label htmlFor="r1">Collaboration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short-stories" id="r2" />
                    <Label htmlFor="r2">Short Stories</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poetry" id="r3" />
                    <Label htmlFor="r3">Poetry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="r4" />
                    <Label htmlFor="r4">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mb-8">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Type your message here..."
                  rows={5}
                  required
                />
              </div>

              <CardFooter className="p-0 flex justify-end">
                <SubmitButton />
              </CardFooter>
            </form>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full md:w-fit" disabled={pending}>
      {pending ? "Sending..." : "Send message"}
    </Button>
  );
}

export default ContactForm;
