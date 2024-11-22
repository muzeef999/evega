import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";

const myNextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    {
      id: "orcid",
      name: "ORCID",
      type: "oauth",
      version: "2.0",
      clientId: process.env.ORCID_CLIENT_ID,
      clientSecret: process.env.ORCID_CLIENT_SECRET,
      authorization: {
        url: "https://orcid.org/oauth/authorize",
        params: { scope: "/authenticate" }, // Replace with a valid scope
      },
      token: "https://orcid.org/oauth/token",
      userinfo: "https://pub.orcid.org/v3.0/me",
      profile: (profile) => ({
        id: profile.orcid,
        name: `${profile["given-names"]} ${profile["family-name"]}`,
        email: profile.email || null,
        image: profile["picture-url"] || null,
      }),
    },

    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      authorization: {
        url: "https://www.linkedin.com/oauth/v2/authorization",
        params: {
          scope: "r_liteprofile r_emailaddress", // Default scopes
        },
      },
      token: {
        url: "https://www.linkedin.com/oauth/v2/accessToken",
        async request({ client, params, checks, provider }) {
          try {
            const response = await client.oauthCallback(provider.callbackUrl, params, checks, {
              exchangeBody: {
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
              },
            });
            return { tokens: response };  // Ensure you're returning the correct token data
          } catch (error) {
            console.error("Error during LinkedIn OAuth callback:", error);
            throw new Error("LinkedIn OAuth callback failed.");
          }
        },
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
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token, user }) {
      // Send access token to the client (to then save it in the database)
      session.user.token = token.accessToken;
      return session;
    },

    async redirect({ baseUrl, url }) {
      // Log and decode the URL to verify
      console.log("===== REDIRECT =====");
      console.log("BASE URL", baseUrl);
      console.log("URL", url);

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;

      // Fallback to dashboard if any issues with the URL
      return `${baseUrl}/dashboard`; 
    },
  },

  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export const GET = (req, res) => NextAuth(req, res, myNextAuthOptions);
export const POST = (req, res) => NextAuth(req, res, myNextAuthOptions);
