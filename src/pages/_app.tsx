import "src/shared/styles/globals.css";
import type { AppProps } from "next/app";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { fas } from "@fortawesome/free-solid-svg-icons";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import { AuthProvider } from "src/modules/auth/auth.context";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "src/shared/clients/apollo.client";
import { SystemProvider } from "src/modules/system/system.context";

config.autoAddCss = false;
library.add(fas);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SystemProvider>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    </SystemProvider>
  );
}

export default MyApp;
