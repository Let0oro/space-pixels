import {
  formType,
  optsType,
  parseMethodInterface,
  pMethodType,
  routeType,
} from "../interfaces/FrontfetchInterface";

export class FrontFetch {
  private static baseUrl = "http://localhost:3000/api/";

  public static parseMethod: parseMethodInterface = {
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
      post: {
        painted: "/painted/",
        purchase: "/purchase/",
        like: "/like/",
        post: "/post/",
      },
      put: "/",
      delete: { one: "/", post: "/post/", like: "/like/" },
    },
    score: {
      get: { get: "/", getAll: "/" },
      post: "/",
      put: "/",
      delete: "/",
    },
  } as const;

  private static async Fetch(url: string, opts = {}) {
    try {
      const response = await fetch(url, { ...opts, credentials: "include", mode: "cors" });
      const data = await response.json();


      if (!response.ok) {
        if (data.error) return data;
        throw new Error(data.error || "Error en la solicitud");
      }

      return data;
    } catch (error) {
      throw new Error("Fetch error: " + error);
    }
  }

  public static async caller(
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

    const url = `${this.baseUrl}${name}${typeMethod ? typePMethod : pMethod}${id || ""}`;
    return await this.Fetch(url, opts);
  }
}
