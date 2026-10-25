import { Suspense } from "react";
import { redirect } from "next/navigation";
import { hasAuthSession } from "@/actions/auth-action";
import SignInForm from "@/components/auth/signin-form";
import { authPageSearchParamsSchema } from "@/schemas/auth-schema";

type SignInPageProps = {
  searchParams: Promise<unknown>;
};

export default function SignInPage(props: SignInPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignInPageContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function SignInPageContent({ searchParams }: SignInPageProps) {
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
    <SignInForm callbackUrl={callbackUrl} customAlias={customAlias} />
  );
}
