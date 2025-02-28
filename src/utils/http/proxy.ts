import {utilsConfig} from "../../projectConfig";
import {getSecret} from "../getSecret";

interface ProxyConfig {
    protocol: string;
    host: string;
    port: number;
    auth: {
        username: string;
        password: string;
    }
}

async function initializedProxy(
  isProxy: boolean
): Promise<false | ProxyConfig> {
  if (!isProxy) return false;

  const proxyInitConfig = utilsConfig.proxyConfig;

  const proxy = JSON.parse(
    await getSecret(proxyInitConfig.secretName)
  );

  const proxyConfig = {
    protocol: proxyInitConfig.protocol,
    host: proxy.host,
    port: proxy.port,
    auth: {
      username: proxy.username,
      password: proxy.password,
    },
  };

  return proxyConfig;
}


export {
  initializedProxy,
};
