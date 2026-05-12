import { ReactNode, useEffect, useReducer } from "react";
import {
  useForm,
  SubmitHandler,
  FieldError,
  UseFormRegister,
} from "react-hook-form";
import { FrontFetch } from "../utils/FrontFetch.ts";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Inputs = {
  nameoremail?: string;
  name?: string;
  email?: string;
  password: string;
};

/** Auth state machine states */
type AuthState =
  | { status: "checking" }
  | { status: "guest" }
  | { status: "loading" }
  | { status: "error"; message: string };

type AuthAction =
  | { type: "SESSION_VALID" }
  | { type: "NO_SESSION" }
  | { type: "SUBMIT" }
  | { type: "SUCCESS" }
  | { type: "ERROR"; message: string }
  | { type: "RESET" };

function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SESSION_VALID": return { status: "checking" }; // stays while navigate runs
    case "NO_SESSION": return { status: "guest" };
    case "SUBMIT": return { status: "loading" };
    case "SUCCESS": return { status: "loading" }; // stays while navigate runs
    case "ERROR": return { status: "error", message: action.message };
    case "RESET": return { status: "guest" };
    default: return { status: "guest" };
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface ErrorSpanProps {
  errorObj: FieldError | { message: string } | undefined;
}

const ErrorSpan = ({ errorObj }: ErrorSpanProps) =>
  errorObj ? <span style={{ color: "#e44" }}>{errorObj.message}</span> : null;

const RegularInput = ({
  title,
  children,
  flex = false,
}: {
  title: string;
  children: ReactNode;
  flex?: boolean;
}) => (
  <label style={{ display: flex ? "flex" : "block", textAlign: "right", gap: flex ? "0.25rem" : "0" }}>
    {title}{"-> "}{children}
  </label>
);

const PassInput = ({
  register,
  clearErrors,
}: {
  register: UseFormRegister<Inputs>;
  clearErrors: (name?: keyof Inputs) => void;
}) => (
  <RegularInput title="password" flex>
    <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
      <input
        id="pass-inp"
        type="password"
        autoComplete="current-password"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "At least 8 characters" },
          maxLength: { value: 24, message: "At most 24 characters" },
          pattern: {
            value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
            message: "Must include lower, upper, number, symbol",
          },
          onChange: () => { clearErrors("password"); },
        })}
      />
      <button
        className="btn-password"
        type="button"
        onClick={({ target }) => {
          const inp: HTMLInputElement | null = document.querySelector("#pass-inp");
          const elem = target as HTMLButtonElement;
          if (inp) {
            const type = inp.type;
            inp.type = type === "password" ? "text" : "password";
            if (elem) {
              elem.className = type === "password" ? "fa fa-eye-slash" : "fa fa-eye";
            }
          }
        }}
      >
        <i className="fa fa-eye"></i>
      </button>
    </div>
  </RegularInput>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const LogSign = ({ type }: { type: "login" | "register" }) => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  const [authState, dispatch] = useReducer(authReducer, { status: "checking" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<Inputs>();

  // ── Session check on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (user.id) {
      dispatch({ type: "SESSION_VALID" });
      navigate("/usermain");
      return;
    }

    const strUser = localStorage.getItem("user");
    if (!strUser) {
      dispatch({ type: "NO_SESSION" });
      return;
    }

    try {
      const parsed = JSON.parse(strUser);
      if (parsed?.id) {
        const { password: _pw, ...safeData } = parsed;
        setUser(safeData);
        dispatch({ type: "SESSION_VALID" });
        navigate("/usermain");
      } else {
        // Corrupt/stale data (raw form inputs saved by old bug) — clear it
        localStorage.removeItem("user");
        dispatch({ type: "NO_SESSION" });
      }
    } catch {
      localStorage.removeItem("user");
      dispatch({ type: "NO_SESSION" });
    }
  }, []);

  // ── Submit handler ────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch({ type: "SUBMIT" });
    try {
      const res = await FrontFetch.caller(
        { name: "player", method: "post", typeMethod: type },
        data
      );
      if (!res.error) {
        if (type === "register") {
          // Register only returns a message; auto-login to get the session cookie
          const loginRes = await FrontFetch.caller(
            { name: "player", method: "post", typeMethod: "login" },
            { nameoremail: data.name ?? data.email, password: data.password }
          );
          if (!loginRes.error) {
            // Store form identifiers (no password) so useSessionExpired can fetch the real user
            const { password: _pw, ...identifiers } = data;
            localStorage.setItem("user", JSON.stringify(identifiers));
            sessionStorage.setItem("sp_onboarding", "1");
            dispatch({ type: "SUCCESS" });
            navigate("/pixel");
          } else {
            dispatch({ type: "ERROR", message: "Registered! Please log in manually." });
          }
        } else {
          // Login: fetch user data to populate context before navigating
          const { password: _pw, ...identifiers } = data;
          localStorage.setItem("user", JSON.stringify(identifiers));
          const player = await FrontFetch.caller({
            name: "player", method: "get", typeMethod: "get",
            id: identifiers.name ?? identifiers.nameoremail,
          });
          const playerData = Array.isArray(player) ? player[0] : (player?.player?.[0] ?? player);
          if (playerData?.id) setUser(playerData);
          dispatch({ type: "SUCCESS" });
          navigate("/usermain");
        }
      } else {
        dispatch({ type: "ERROR", message: res.error });
      }
    } catch {
      dispatch({ type: "ERROR", message: "Unexpected error occurred" });
    }
  };

  const handleInputChange = (field: keyof Inputs) => () => {
    clearErrors(field);
    if (authState.status === "error") dispatch({ type: "RESET" });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const isLoading = authState.status === "loading";

  return (
    <form
      style={{ display: "flex", maxWidth: "400px", flexDirection: "column", gap: "0.5rem", alignItems: "end" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3>{type === "register" ? "Sign Up" : "Login"}</h3>

      {type === "login" ? (
        <>
          <RegularInput title="name or email">
            <input
              type="text"
              autoComplete="username"
              {...register("nameoremail", {
                required: "Name or Email is required",
                onChange: handleInputChange("nameoremail"),
              })}
            />
          </RegularInput>
          <ErrorSpan errorObj={errors.nameoremail} />
        </>
      ) : (
        <>
          <RegularInput title="name">
            <input
              autoComplete="username"
              {...register("name", {
                required: "Name is required",
                onChange: handleInputChange("name"),
              })}
            />
          </RegularInput>
          <ErrorSpan errorObj={errors.name} />

          <RegularInput title="email">
            <input
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
                onChange: handleInputChange("email"),
              })}
            />
          </RegularInput>
          <ErrorSpan errorObj={errors.email} />
        </>
      )}

      <PassInput register={register} clearErrors={clearErrors} />
      <ErrorSpan errorObj={errors.password} />

      <hr style={{ margin: ".3rem 0", width: "100%" }} />

      {authState.status === "error" && (
        <ErrorSpan errorObj={{ message: authState.message }} />
      )}

      <input
        type="submit"
        style={{ cursor: isLoading ? "wait" : "pointer", opacity: isLoading ? 0.6 : 1 }}
        disabled={isLoading}
        value={isLoading ? "..." : type === "register" ? "Register" : "Login"}
      />
    </form>
  );
};

export default LogSign;
