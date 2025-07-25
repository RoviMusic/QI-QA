import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { ZodError } from "zod";
import { signInSchema } from "@/modules/auth/utils/validation";
import { authService } from "@/modules/auth/services/authService";

const providers: Provider[] = [
  Credentials({
    id: 'dolibarr-sso',
    name: 'Dolibarr SSO',
    credentials: {
       username: { label: "Usuario" },
       password: { label: "Contraseña", type: "password" },
      //user: { type: 'object' }
    },
    authorize: async (credentials) => {
      try {
        const { username, password } = await signInSchema.parseAsync(credentials);

        //const user = await authService.authenticate(username, password);
        const user = credentials.username;
        console.log('user de auth ', user)

        if (!user) {
          throw new Error("Usuario inválido.");
        }
        console.log('user ', user)
        // return JSON object with the user data
        return user;
      } catch (error) {
        if (error instanceof ZodError) {
          // Return `null` to indicate that the credentials are invalid
          return null;
        }
        console.error("Auth error:", error);
        return null;
      }
    },
  }),
  MicrosoftEntraID({
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
    issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always redirects to a specific page after login
      return `${baseUrl}/dashboard`; //or any route you desire
    },
  },
});
