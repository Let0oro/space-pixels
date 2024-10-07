interface parseMethodInterface {
  player: {
    get: { get: string; session: string; getAll: string };
    post: {
      register: string;
      login: string;
      logout: string;
    };
    put: {
      select: string;
      password: string;
      follow: string;
      unfollow: string;
    };
    delete: string;
  };
  ship: {
    get: {
      get: string;
      getAll: string;
      public: string;
      liked: string;
      publicplayer: string;
      likedplayer: string;
    };
    post: { painted: string; post: string; like: string; purchase: string };
    put: string;
    delete: {one: string; post: string, like: string;}
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
type nameType = "player" | "ship" | "score";
type typeMethodType =
  | "register"
  | "login"
  | "logout"
  | "get"
  | "getAll"
  | "session"
  | "select"
  | "password"
  | "painted"
  | "liked"
  | "public"
  | "likedplayer"
  | "publicplayer" | "post" | "one" | "like" | "purchase" | "follow" | "unfollow";
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
    player: {
      get: { get: "/one/", getAll: "/all/", session: "/session" },
      post: {
        register: "/",
        login: "/login",
        logout: "/logout",
      },
      put: {
        select: "/select/",
        password: "/password/",
        follow: "/follow/",
        unfollow: "/unfollow/",
      },
      delete: "/",
    },
    ship: {
      get: {
        get: "/one/",
        getAll: "/all/",
        public: "/public/",
        liked: "/liked/",
        publicplayer: "/public/player/",
        likedplayer: "/liked/player/",
      },
      post: { painted: "/painted/", purchase: "/purchase/", like: "/like/",  post: "/post/" },
      put: "/",
      delete: {one: "/", post: "/post/", like: "/like/"},
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
        if (
          [
            "session expired",
            "Player already exists with this name or email, try with other",
          ].includes(data.message)
        ) {
          return data;
        }
        throw new Error(
          data.message || data.statusText || "Error en la solicitud"
        );
        // return {error: data.message || data.statusText || "Error en la solicitud"};
      }

      return data;
    } catch (error) {
      // console.error("Fetch error: " + error);
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
    const typePMethod: string | undefined = typeMethod
      ? (pMethod as any)[typeMethod]
      : undefined;

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

    const url = `${this.baseUrl}${name}${typeMethod ? typePMethod : pMethod}${id || ""}`;
    console.log({ typeMethod, id, pMethod, opts, url });
    return await this.Fetch(url, opts);
  }
}

export const frontFetchObj = {};
