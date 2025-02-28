import axios, {AxiosResponse} from "axios";
import {initializedProxy} from "./proxy";

interface HttpHeaders {
  [key: string]: string
}

interface HttpParams {
  [key: string]: string | number | boolean;
}

interface HttpOptions {
  headers: HttpHeaders;
  params: HttpParams;
  isProxy: boolean;
}

async function httpGet(
  path: string,
  settings: HttpOptions = {
    headers: {},
    params: {},
    isProxy: false,
  }
): Promise<AxiosResponse> {
  try {
    const proxyConfig = await initializedProxy(settings.isProxy);

    const response = await axios.get(path, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "MyApp/1.0",
        ...settings.headers,
      },
      params: settings.params,
      proxy: proxyConfig,
    });

    return response;
  } catch (error) {
    console.error(`Error making GET request to ${path}:`, error);
    throw new Error(`Failed to make GET request to ${path}`);
  }
}


export {
  httpGet,
};
