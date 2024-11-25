import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";

// Custom ORCID Provider
const ORCIDProvider = {
  id: "orcid",
  name: "ORCID",
  type: "oauth",
  version: "2.0",
  wellKnown: "https://orcid.org/.well-known/openid-configuration",
  authorization: {
    url: "https://orcid.org/oauth/authorize",
    params: {
      scope: "/authenticate",
    },
  },
  token: {
    url: "https://orcid.org/oauth/token",
    async request(context) {
      const { params } = context;
      const response = await fetch("https://orcid.org/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.ORCID_CLIENT_ID,
          client_secret: process.env.ORCID_CLIENT_SECRET,
          grant_type: "authorization_code",
          code: params.code,
          redirect_uri: process.env.NEXTAUTH_URL,
        }),
      });

      const tokens = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to exchange authorization code for tokens: ${JSON.stringify(
            tokens
          )}`
        );
      }

      return {
        access_token: tokens.access_token,
        id_token: tokens.id_token,
        expires_in: tokens.expires_in,
      };
    },
  },
  profile(profile, tokens) {
    return {
      id: tokens.id_token,
      name: profile.name || tokens.orcid,
      email: profile.email || null,
      image: null, // ORCID does not provide an image
    };
  },
  options: {
    clientId: process.env.ORCID_CLIENT_ID,
    clientSecret: process.env.ORCID_CLIENT_SECRET,
  },
};

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    ORCIDProvider,
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: { scope: "r_liteprofile r_emailaddress" },
      },
      profile(profile, tokens) {
        return {
          id: profile.id,
          name: profile.localizedFirstName + " " + profile.localizedLastName,
          email: profile.emailAddress,
          image: profile.pictureUrl,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("Sign In User:", user);
      console.log("Account Info:", account);
      console.log("Profile Data:", profile);
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Error handling page
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode for development
});
