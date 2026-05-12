"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  problemStatement: z.string().optional(),
  whyItMatters: z.string().optional(),
  appetite: z.string().optional(),
  constraints: z.string().optional(),
  dependencies: z.string().optional(),
  successMetrics: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PbiFormProps {
  projectId: string;
  defaultValues?: Partial<FormValues>;
  pbiId?: string;
}

export function PbiForm({ projectId, defaultValues, pbiId }: PbiFormProps) {
  const router = useRouter();
  const isEditing = !!pbiId;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      problemStatement: defaultValues?.problemStatement ?? "",
      whyItMatters: defaultValues?.whyItMatters ?? "",
      appetite: defaultValues?.appetite ?? "",
      constraints: defaultValues?.constraints ?? "",
      dependencies: defaultValues?.dependencies ?? "",
      successMetrics: defaultValues?.successMetrics ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const url = isEditing
        ? `/api/projects/${projectId}/pbis/${pbiId}`
        : `/api/projects/${projectId}/pbis`;
      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, projectId }),
      });
      if (!res.ok) throw new Error();
      toast.success(isEditing ? "PBI updated" : "PBI created");
      router.push("/projects");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  }

  const textField = (name: keyof FormValues, label: string, placeholder: string, description?: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <Textarea placeholder={placeholder} className="min-h-20 resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="Export Redesign — Phase 1" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Problem Brief</h2>
          {textField("problemStatement", "Problem statement", "What problem are we solving?", "The specific issue this work addresses.")}
          {textField("whyItMatters", "Why it matters", "Why does solving this matter?", "Business or customer impact.")}
          {textField("appetite", "Appetite / scope", "Small batch, 2 weeks. Scope is limited to the export modal only.", "How much time/effort is this worth?")}
          {textField("constraints", "Constraints", "Must work within existing component library. No new dependencies.", "Technical or design constraints.")}
          {textField("dependencies", "Dependencies", "Depends on the new data pipeline (ETA end of sprint 12).")}
          {textField("successMetrics", "Success metrics", "Export task completion rate >85%. Support tickets about export down 30%.")}
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create PBI"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}
