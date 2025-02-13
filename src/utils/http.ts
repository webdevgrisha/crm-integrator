import axios from "axios";
import {getSecret} from "../utils/getSecret";

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
    const proxy = JSON.parse(await getSecret("proxy"));

    const proxyConfig = {
        protocol: "http",
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