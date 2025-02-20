interface SecretManagerConfig {
    projectId: string;
    versionId: string;
}

interface ProxyConfig {
    secretName: string;
    protocol: string;
}

interface UtilsConfig {
    secretManagerConfig: SecretManagerConfig;
    proxyConfig: ProxyConfig;
}


const utilsConfig: UtilsConfig = {
  secretManagerConfig: {
    projectId: "crm-synchronisation",
    versionId: "latest",
  },
  proxyConfig: {
    secretName: "proxy",
    protocol: "http",
  },
};


export {
  utilsConfig,
};
