declare const $fetch: <T = any>(url: string, init?: RequestInit) => Promise<T>;

import { HttpMethod } from "~/enums/http-method";

export interface RequestConfig {
  baseURL: string;
  path: string;
  queryParams: Record<string, string>;
  urlParams: Record<string, string>;
  headers: Record<string, string>;
  body: any;
  method: HttpMethod;
}

export class RequestBuilder {
  private config: RequestConfig = {
    baseURL: "",
    path: "",
    queryParams: {},
    urlParams: {},
    headers: {},
    body: {},
    method: HttpMethod.GET,
  };

  setBaseURL(url: string): this {
    this.config.baseURL = url.endsWith("/") ? url.slice(0, -1) : url;
    return this;
  }

  setPath(path: string): this {
    this.config.path = path.startsWith("/") ? path : `/${path}`;
    return this;
  }

  addQueryParam(key: string, value: string): this {
    this.config.queryParams[key] = value;
    return this;
  }

  addQueryParams(params: Record<string, string>): this {
    this.config.queryParams = { ...this.config.queryParams, ...params };
    return this;
  }

  addURLParam(key: string, value: string): this {
    this.config.urlParams[key] = value;
    return this;
  }

  addHeader(key: string, value: string): this {
    this.config.headers[key] = value;
    return this;
  }

  addHeaders(headers: Record<string, string>): this {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  setBody<T>(body: T): this {
    this.config.body = body;
    return this;
  }

  setMethod(method: HttpMethod): this {
    this.config.method = method;
    return this;
  }

  private buildURL(): string {
    let url = this.config.baseURL + this.config.path;

    // Replace URL parameters, e.g. '/users/:id' -> '/users/123'
    Object.entries(this.config.urlParams).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });

    // Append query parameters if available.
    if (Object.keys(this.config.queryParams).length > 0) {
      const queryString = Object.entries(this.config.queryParams)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join("&");
      url += `?${queryString}`;
    }

    return url;
  }

  private buildFetchOptions(): RequestInit {
    const options: RequestInit = {
      method: this.config.method,
      headers: this.config.headers as HeadersInit,
    };

    if (this.config.body && !["GET", "HEAD"].includes(this.config.method)) {
      options.body =
        typeof this.config.body === "string"
          ? this.config.body
          : JSON.stringify(this.config.body);
    }

    return options;
  }

  async execute<T>(): Promise<T> {
    try {
      const finalUrl = this.buildURL();
      const options = this.buildFetchOptions();
      return await $fetch<T>(finalUrl, options);
    } catch (error: any) {
      throw new Error(error.message || "Request failed");
    }
  }

  reset(): this {
    this.config = {
      baseURL: "",
      path: "",
      queryParams: {},
      urlParams: {},
      headers: {},
      body: {},
      method: HttpMethod.GET,
    };
    return this;
  }
}
