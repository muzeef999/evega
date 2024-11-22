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
      scope: 'r_liteprofile r_emailaddress',
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
    async signIn(user, account, profile) {
      console.log('User  Profile:', profile);
      return true; // Allow sign in
    },
    async redirect(url, baseUrl) {
      return baseUrl; // Redirect to base URL after sign in
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
