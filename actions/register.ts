// app/register/page.tsx
import { registerUser } from "@/actions/register";

export default function RegisterPage() {
  return (
    <form action={registerUser}>
       {/* Your input fields here */}
       <button type="submit">Create Account</button>
    </form>
  );
}