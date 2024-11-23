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
          params: {
            scope: "/authenticate", 
            redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/orcid`, 
                               },
                      },
       token: "https://orcid.org/oauth/token",
       userinfo: { 
         url: "https://pub.orcid.org/v3.0/me", 
          async request(context) { 
            const res = await fetch("https://pub.orcid.org/v3.0/me", 
                {
                  headers: 
                  {
                    Authorization: `Bearer ${context.tokens.access_token}`, 
                       },
                  }); 
            const profile = await res.json();
            return profile; 
          }, 
       },
       profile(profile) { 
         return { 
           id: profile.orcid, 
           name: `${profile["name"]["given-names"]["value"]} ${profile["name"]["family-name"]["value"]}`, 
           email: profile.email || null, image: profile["picture-url"] || null, 
         }; 
       }, 
     },


    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      wellKnown: 'https://www.linkedin.com/oauth/.well-known/openid-configuration',
      authorization: {
        params: { scope: 'openid profile email' },
      },
      issuer: 'https://www.linkedin.com',
      jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
      profile(profile, tokens) {
        const defaultImage =
          'https://cdn-icons-png.flaticon.com/512/174/174857.png';
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture ?? defaultImage,
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
    async authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user; // Check if the user is logged in
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard'); // Check if accessing dashboard

      if (isOnDashboard) {
        return isLoggedIn; // Allow access if logged in; otherwise, deny
      }

      // Redirect logged-in users to dashboard if they aren't already there
      if (isLoggedIn) {
        return `${nextUrl.origin}/dashboard`; // Return URL for redirect
      }

      return true; // Allow access to other pages for unauthenticated users
    },
    
    async signIn({ user, account, profile, email, credentials }) {
      console.log("SignIn Callback: ", { user, account, profile, email });
      return true; // Returning false blocks the sign-in
    },
    async jwt({ token, account, profile }) {
      console.log("JWT Callback: ", { token, account, profile });
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl; // Ensures valid redirects
    },
    async session({ session, token }) {
      console.log("Session Callback: ", { session, token });
      session.accessToken = token.accessToken;
      return session;
    },

  },
  

  pages: {
    signIn: "/login",
    error: "/api/auth/error",
    dashboard: "/dashboard",
  },
  events: {
    error: async (error) => {
      console.error("NextAuth Error:", error);
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export const GET = (req, res) => NextAuth(req, res, myNextAuthOptions);
export const POST = (req, res) => NextAuth(req, res, myNextAuthOptions);
