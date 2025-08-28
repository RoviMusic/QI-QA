import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin"; //configuracion para internationalizacion

const nextConfig: NextConfig = {
  //basePath: "/qi",
  async rewrites() {
    return [
      // Proxy para directorios específicos
      {
        source: "/erp/:path*",
        destination: "http://192.168.0.234/rovimusic/:path*",
      },
      // Luego rutas más generales
      {
        source: "/societe/:path*",
        destination: "http://192.168.0.234/rovimusic/societe/:path*",
      },
      {
        source: "/user/:path*",
        destination: "http://192.168.0.234/rovimusic/user/:path*",
      },
      {
        source: "/admin/:path*",
        destination: "http://192.168.0.234/rovimusic/admin/:path*",
      },
      {
        source: "/includes/:path*",
        destination: "http://192.168.0.234/rovimusic/includes/:path*",
      },
      {
        source: "/theme/:path*",
        destination: "http://192.168.0.234/rovimusic/theme/:path*",
      },
      {
        source: "/custom/:path*",
        destination: "http://192.168.0.234/rovimusic/custom/:path*",
      },
      {
        source: "/core/:path*",
        destination: "http://192.168.0.234/rovimusic/core/:path*",
      },
      // Capturar TODAS las rutas PHP
      {
        source: "/:path*.php",
        destination: "http://192.168.0.234/rovimusic/:path*.php",
      },
      // Capturar TODAS las rutas JS
      {
        source: "/:path*.js",
        destination: "http://192.168.0.234/rovimusic/:path*.js",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

//module.exports = { serverExternalPackages: ["mysql2"] };

const withNextIntl = createNextIntlPlugin(); //configuracion para internationalizacion

export default withNextIntl(nextConfig);
