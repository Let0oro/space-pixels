export interface parseMethodInterface {
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
    delete: { one: string; post: string; like: string };
  };
  score: {
    get: { get: string; getAll: string };
    post: string;
    put: string;
    delete: string;
  };
}

export type nameType = keyof parseMethodInterface;
export type methodType = keyof parseMethodInterface[nameType];
export type pMethodType = parseMethodInterface[nameType][methodType];
export type typeMethodType =
  | keyof parseMethodInterface[nameType][methodType]
  | string;

export type routeType = {
  name: nameType;
  method: methodType;
  typeMethod?: typeMethodType;
  id?: string;
};
export type optsType = {
  method?: string;
  headers?: { "Content-Type": string };
  body?: any;
  credentials?: string;
};
export type formType = any;
