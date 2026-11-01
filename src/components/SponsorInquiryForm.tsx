import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Send, CheckCircle } from "lucide-react";

const schema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(100),
  contact_name: z.string().trim().min(1, "Your name is required").max(100),
  contact_email: z.string().trim().email("Enter a valid email").max(255),
  website_url: z.string().trim().url("Enter a valid URL").max(500).or(z.literal("")),
  product_description: z.string().trim().min(10, "Tell us a bit more about your products (min 10 chars)").max(2000),
  placement_interest: z.string().min(1, "Select a placement type"),
  message: z.string().trim().max(2000).optional(),
});

type FormData = z.infer<typeof schema>;




export default function SponsorInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      placement_interest: "",
      website_url: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("submit-partner-inquiry", {
        body: {
          company_name: data.company_name,
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          website_url: data.website_url || null,
          product_description: data.product_description,
          placement_interest: data.placement_interest,
          message: data.message || null,
        },
      });

      if (error || !result?.success) throw error ?? new Error("Submission failed");

      setSubmitted(true);
      toast({
        title: "Inquiry sent!",
        description: "Thanks! Our team will reply to your email within 48 hours.",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };


  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle className="h-10 w-10 text-primary" />
        <h3 className="font-display text-xl font-bold">Thank you!</h3>
        <p className="text-sm text-muted-foreground">
          We've received your inquiry and will be in touch within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="company_name">Company / Brand Name *</Label>
          <Input id="company_name" placeholder="Acme Seeds" {...register("company_name")} />
          {errors.company_name && <p className="text-xs text-destructive">{errors.company_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_name">Your Name *</Label>
          <Input id="contact_name" placeholder="Jane Doe" {...register("contact_name")} />
          {errors.contact_name && <p className="text-xs text-destructive">{errors.contact_name.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact_email">Email *</Label>
          <Input id="contact_email" type="email" placeholder="jane@acme.com" {...register("contact_email")} />
          {errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website_url">Website</Label>
          <Input id="website_url" placeholder="https://acme.com" {...register("website_url")} />
          {errors.website_url && <p className="text-xs text-destructive">{errors.website_url.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product_description">Tell us about your products *</Label>
        <Textarea
          id="product_description"
          placeholder="What do you sell? Who's your target audience? Any unique selling points?"
          rows={3}
          {...register("product_description")}
        />
        {errors.product_description && <p className="text-xs text-destructive">{errors.product_description.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Placement Type *</Label>
        <Select onValueChange={(v) => setValue("placement_interest", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select placement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="banner">Banner Ad</SelectItem>
            <SelectItem value="product_listing">Sponsored Partner Listing</SelectItem>
            <SelectItem value="sponsored_post">Sponsored Blog Article</SelectItem>
            <SelectItem value="other">Full Bundle (All of the above)</SelectItem>
          </SelectContent>
        </Select>
        {errors.placement_interest && <p className="text-xs text-destructive">{errors.placement_interest.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Anything else?</Label>
        <Textarea id="message" placeholder="Special requests, questions, promo codes..." rows={2} {...register("message")} />
      </div>

      <Button type="submit" size="lg" className="w-full rounded-full gap-2" disabled={submitting}>
        <Send className="h-4 w-4" />
        {submitting ? "Sending..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}
