import { Suspense } from "react";
import { redirect } from "next/navigation";
import { hasAuthSession } from "@/actions/auth-action";
import SignUpForm from "@/components/auth/signup-form";
import { authPageSearchParamsSchema } from "@/schemas/auth-schema";

type SignUpPageProps = {
  searchParams: Promise<unknown>;
};

export default function SignUpPage(props: SignUpPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignUpPageContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function SignUpPageContent({ searchParams }: SignUpPageProps) {
  const [isAuthenticated, params] = await Promise.all([
    hasAuthSession(),
    searchParams,
  ]);

  const { callbackUrl, customAlias } =
    authPageSearchParamsSchema.parse(params);

  if (isAuthenticated) {
    redirect(callbackUrl);
  }

  return (
    <SignUpForm callbackUrl={callbackUrl} customAlias={customAlias} />
  );
}
