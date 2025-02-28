interface SecretManagerConfig {
    projectId: string;
    versionId: string;
}

interface ProxyInitConfig {
    secretName: string;
    protocol: string;
}

interface UtilsConfig {
    secretManagerConfig: SecretManagerConfig;
    proxyConfig: ProxyInitConfig;
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
