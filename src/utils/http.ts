import axios from "axios";
import { getSecret } from "../utils/getSecret";
import { utilsConfig } from "../projectConfig";

interface HttpHeaders {
    [key: string]: string
}

interface HttpParams {
    [key: string]: any
}

async function httpGet(
    path: string,
    headers: HttpHeaders,
    params: HttpParams,
    isProxy: boolean = false
) {
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
    }

    const response = await axios.get(path, {
        headers: {
            "Accept": "application/json",
            "User-Agent": "MyApp/1.0",
            ...headers,
        },
        params: params,
        proxy: isProxy && proxyConfig,
    });

    return response;
}

export {
    httpGet
}