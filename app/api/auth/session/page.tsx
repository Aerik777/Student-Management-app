import { useSession } from "next-auth/react";

const { data: session } = useSession();
console.log(session?.user?.name);