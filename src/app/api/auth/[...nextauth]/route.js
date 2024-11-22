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
    async redirect({ url, baseUrl }) {
      // Decode the URL to ensure it's readable and not encoded
      const decodedUrl = decodeURIComponent(url);
      console.log("Decoded URL:", decodedUrl);
      console.log("ch");
  
      // Redirect to '/dashboard' if the decoded URL is valid or falls under the expected condition
      // You can replace this with your condition if needed, or just default to /dashboard
      return decodedUrl.startsWith(baseUrl) ? '/dashboard' : '/dashboard';
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
