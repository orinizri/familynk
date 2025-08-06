import axios, { AxiosInstance, AxiosRequestConfig, Canceler } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Extend Axios config to support an `abort` field
export type AbortableAxiosConfig = AxiosRequestConfig & {
  abort?: (cancel: Canceler) => void;
};

export const didAbort = (error) => axios.isCancel(error);

const getCancelSource = () => axios.CancelToken.source();

export const isApiError = (error) =>
  axios.isAxiosError(error) && error.response;

type RequestFn<R> = (...args: unknown[]) => Promise<R>;

export function withAbort<R>(fn: RequestFn<R>) {
  console.log("withAbort called for function:", fn.name);
  return async (...args: unknown[]): Promise<R> => {
    let config: AbortableAxiosConfig = {};
    const lastArg = args[args.length - 1];

    // If last arg is a config object, assume it's the config
    if (
      typeof lastArg === "object" &&
      lastArg !== null &&
      !Array.isArray(lastArg)
    ) {
      config = lastArg;
      args = args.slice(0, -1); // remove config from args for now
    }

    const { abort, ...restConfig } = config;

    if (typeof abort === "function") {
      const { cancel, token } = getCancelSource();
      restConfig.cancelToken = token;
      abort(cancel);
    }

    try {
      return await fn(...args, restConfig);
    } catch (err) {
      if (axios.isCancel(err)) {
        const tagged = Object.assign(new Error("Request aborted"), err, {
          abort: true,
        });
        throw tagged;
      }
      throw err;
    }
  };
}

const apiFactory = (axiosInstance: AxiosInstance) => ({
  get: withAbort((url: string, config: AxiosRequestConfig = {}) =>
    axiosInstance.get(url, config)
  ),
  post: withAbort(
    (url: string, data: unknown, config: AxiosRequestConfig = {}) =>{
      console.log("POST request to:", url, "with data:", data);
      console.log("axiosInstance", axiosInstance.getUri())
      return axiosInstance.post(url, data, config)}
  ),
  put: withAbort(
    (url: string, data: unknown, config: AxiosRequestConfig = {}) =>
      axiosInstance.put(url, data, config)
  ),
  delete: withAbort((url: string, config: AxiosRequestConfig = {}) =>
    axiosInstance.delete(url, config)
  ),
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = apiFactory(axiosInstance);
