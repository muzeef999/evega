import { useRouter } from "next/navigation";

export default function AuthErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessage = (() => {
    switch (error) {
      case "OAuthSignin":
        return "There was an error signing in.";
      case "OAuthCallback":
        return "The callback from the provider failed.";
      case "OAuthAccountNotLinked":
        return "This account is already linked with a different provider.";
      default:
        return "An unknown error occurred.";
    }
  })();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Authentication Error</h1>
      <p>{errorMessage}</p>
      <button onClick={() => router.push("/login")}>Back to Login</button>
    </div>
  );
}
