import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  rollNumber: z.string().min(5, "Roll number must be at least 5 characters"),
  department: z.enum(["CS", "EE", "ME", "CE"], {
    errorMap: () => ({ message: "Please select a valid department" }),
  }),
});

export type StudentFormValues = z.infer<typeof studentSchema>;