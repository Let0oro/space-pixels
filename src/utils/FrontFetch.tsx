interface parseMethodInterface {
  user: {
    get: { get: string; session: string; getAll: string };
    post: {
      register: string;
      login: string;
      logout: string;
    };
    put: string;
    delete: string;
  };
  pixel: {
    get: { get: string; getAll: string };
    post: string;
    put: string;
    delete: string;
  };
  score: {
    get: { get: string; getAll: string };
    post: string;
    put: string;
    delete: string;
  };
}

type pMethodType = parseMethodInterface[nameType][methodType] | string;

type methodType = "get" | "put" | "post" | "delete";
type nameType = "user" | "pixel" | "score";
type typeMethodType =
  | "register"
  | "login"
  | "logout"
  | "get"
  | "getAll"
  | "session";
type routeType = {
  name: nameType;
  method: methodType;
  typeMethod?: typeMethodType;
  id?: string;
};
type optsType = {
  method?: string;
  headers?: { "Content-Type": string };
  body?: any;
  credentials?: string;
};
type formType = any;

export class FrontFetch {
  static baseUrl = "http://localhost:3000/api/";

  static parseMethod: parseMethodInterface = {
    user: {
      get: { get: "/one/", getAll: "/all/", session: "/session" },
      post: {
        register: "/",
        login: "/login",
        logout: "/logout",
      },
      put: "/",
      delete: "/",
    },
    pixel: {
      get: { get: "/", getAll: "/" },
      post: "/",
      put: "/",
      delete: "/",
    },
    score: {
      get: { get: "/", getAll: "/" },
      post: "/",
      put: "/",
      delete: "/",
    },
  } as const;

  static async Fetch(url: string, opts = {}) {
    try {
      const response = await fetch(url, { ...opts, mode: "cors" });
      const data = await response.json();

      console.log({ data, opts });

      if (!response.ok) {
        throw new Error(
          data.message || data.statusText || "Error en la solicitud"
        );
      }

      return data;
    } catch (error) {
      console.error("Fetch error: " + error);
      throw error;
    }
  }

  static async caller(
    route: routeType,
    formData?: formType,
    opts: optsType = {}
  ) {
    const { parseMethod }: { parseMethod: parseMethodInterface } = this;
    const { name, method, typeMethod, id }: routeType = route;
    const pMethod: pMethodType = parseMethod[name][method];
    const  typePMethod: string | undefined = typeMethod ? (pMethod as any)[typeMethod] : undefined;

    console.log({ typeMethod, id, pMethod });

    opts = {
      method: method.toUpperCase(),
      ...opts,
    };

    if (formData) {
      formData = JSON.stringify({ ...formData });
      opts.headers = { "Content-Type": "application/json" };

      opts.body = formData;
    }
    // if (name != "user" || method != "get") opts.credentials = "include";
    opts.credentials = "include";

    console.log({ opts });

    const url = `${this.baseUrl}${name}${typeMethod ? typePMethod : pMethod}${id || ""}`;
    console.log({ url });
    return await this.Fetch(url, opts);
  }
}

export const frontFetchObj = {};
