"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/shared/tag-input";
import type { Reviewer } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  team: z.string().optional(),
  seniority: z.string().optional(),
  critiqueTendencies: z.array(z.string()),
  commonFeedbackThemes: z.array(z.string()),
  commonQuestions: z.array(z.string()),
  preferredFraming: z.array(z.string()),
  personaSummary: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ReviewerFormProps {
  defaultValues?: Partial<Reviewer>;
  reviewerId?: string;
}

const TENDENCY_SUGGESTIONS = [
  "simplicity-focused",
  "business-value-oriented",
  "dev-feasibility-sensitive",
  "edge-case-heavy",
  "scalability-focused",
  "customer-journey-focused",
];

const FRAMING_SUGGESTIONS = [
  "customer-value framing",
  "business-impact framing",
  "scalability framing",
  "simplicity framing",
  "implementation framing",
];

export function ReviewerForm({ defaultValues, reviewerId }: ReviewerFormProps) {
  const router = useRouter();
  const isEditing = !!reviewerId;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      role: defaultValues?.role ?? "",
      team: defaultValues?.team ?? "",
      seniority: defaultValues?.seniority ?? "",
      critiqueTendencies: defaultValues?.critiqueTendencies ?? [],
      commonFeedbackThemes: defaultValues?.commonFeedbackThemes ?? [],
      commonQuestions: defaultValues?.commonQuestions ?? [],
      preferredFraming: defaultValues?.preferredFraming ?? [],
      personaSummary: defaultValues?.personaSummary ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const url = isEditing ? `/api/reviewers/${reviewerId}` : "/api/reviewers";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(isEditing ? "Reviewer updated" : "Reviewer created");
      router.push("/reviewers");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Identity */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Identity</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jordan Lee" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <FormControl>
                    <Input placeholder="Platform" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seniority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seniority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select seniority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="vp">VP</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Critique Tendencies */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Critique Tendencies</h2>
          <FormField
            control={form.control}
            name="critiqueTendencies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tendencies</FormLabel>
                <FormDescription>
                  How this reviewer tends to approach critiques. Suggestions: {TENDENCY_SUGGESTIONS.join(", ")}.
                </FormDescription>
                <FormControl>
                  <TagInput value={field.value} onChange={field.onChange} placeholder="Add tendency…" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commonFeedbackThemes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Common Feedback Themes</FormLabel>
                <FormDescription>
                  Recurring topics in their critiques (e.g. hierarchy, density, discoverability).
                </FormDescription>
                <FormControl>
                  <TagInput value={field.value} onChange={field.onChange} placeholder="Add theme…" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commonQuestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Common Questions</FormLabel>
                <FormDescription>
                  Questions they frequently ask in reviews.
                </FormDescription>
                <FormControl>
                  <TagInput value={field.value} onChange={field.onChange} placeholder="What is the primary action?" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferredFraming"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Framing</FormLabel>
                <FormDescription>
                  How they prefer design decisions to be framed. Suggestions: {FRAMING_SUGGESTIONS.join(", ")}.
                </FormDescription>
                <FormControl>
                  <TagInput value={field.value} onChange={field.onChange} placeholder="Add framing style…" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Persona Summary */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Persona Summary</h2>
          <FormField
            control={form.control}
            name="personaSummary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormDescription>
                  A plain-language description of this reviewer's perspective. Can be written manually or generated from critique history.
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Jordan is a senior PM who prioritizes business impact and implementation feasibility. They consistently question whether features justify their complexity and push back on anything that feels like a solution looking for a problem."
                    className="min-h-28 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create reviewer"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
