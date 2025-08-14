// middleware.js
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import {routerConfig} from "@/lib/routes"

function handleDolibarr(request) {
  if (request.nextUrl.pathname.startsWith("/rovimusic/")) {
    const newUrl = new URL(
      request.nextUrl.pathname.replace("/rovimusic/", "/erp/"),
      request.nextUrl
    );
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

function isRouterMatch(path, routes) {
  return routes.some((route) => {
    if (typeof route === "string") {
      return path === route || path.startsWith(route + "/");
    }
    if (route instanceof RegExp) {
      return route.test(path);
    }
    return false;
  });
}

function getRouteType(path) {
  // Rutas públicas exactas
  if (routerConfig.public.includes(path)) {
    return "public";
  }

  // Patrones protegidos
  if (isRouterMatch(path, routerConfig.protectedPatterns)) {
    return "protected";
  }

  // Por defecto, las rutas no definidas son protegidas
  // Esto es más seguro para aplicaciones empresariales
  return "protected";
}

// async function handleAuth(request) {
//   const path = request.nextUrl.pathname;
//   console.log("paaaaaaaath ", request.cookies);
//   console.log("path ", request.cookies.get('DOLSESSID_25c04083ab55fcdf04dd76a5a68cc2d3d9825ac5'));
//   const routeType = getRouteType(path);

//   const cookie = request.cookies.get('session')?.value;
//   const session = await decrypt(cookie);
//   const isAuthenticated = session?.userId;
//   console.log("sessss ", cookie);

//   // Rutas públicas
//   if (routeType === "public") {
//     // Si está autenticado y trata de ir a login/register, redirigir
//     if (isAuthenticated && path === "/") {
//       return NextResponse.redirect(
//         new URL(routerConfig.redirects.afterLogin, request.nextUrl)
//       );
//     }
//     return null;
//   }

//   // Rutas protegidas
//   if (routeType === "protected" && !isAuthenticated) {
//     return NextResponse.redirect(
//       new URL(routerConfig.redirects.unauthorized, request.nextUrl)
//     );
//   }

//   return null;
// }

export async function middleware(request) {
  // const authResponse = await handleAuth(request);
  // if (authResponse) return authResponse;

  const dolResponse = handleDolibarr(request);
  if (dolResponse) return dolResponse;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/rovimusic/:path*",
    //"/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
