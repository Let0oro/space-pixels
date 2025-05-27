import { ReactNode, useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  FieldError,
  UseFormRegister,
} from "react-hook-form";
import { FrontFetch } from "../utils/FrontFetch.ts";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";

type Inputs = {
  nameoremail?: string;
  name?: string;
  email?: string;
  password: string;
};

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
    <div style={{
      display: "flex", alignItems: "center", position: "relative"
    }}>
      <input
        id="pass-inp"
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "At least 8 characters",
          },
          maxLength: {
            value: 24,
            message: "At most 24 characters",
          },
          pattern: {
            value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
            message: "Must include lower, upper, number, symbol",
          },
          onChange: () => {
            clearErrors("password");
          },
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

const LogSign = ({ type }: { type: "login" | "register" }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | undefined>();
  const { user, setUser } = useUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<Inputs>();

  const [showMessage, setShowMessage] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await FrontFetch.caller(
        { name: "player", method: "post", typeMethod: type },
        data
      );
      if (!res.error) {
        setMessage("Loading...");
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        navigate(type === "register" ? "/pixel" : "/usermain");
      } else {
        setMessage(res.error);
        setShowMessage(true);
      }
    } catch (error) {

      setMessage("Unexpected error occurred");
      setShowMessage(true);
    }
  };

  const handleInputChange = (field: keyof Inputs) => () => {
    clearErrors(field);
    setMessage(undefined);
    setShowMessage(false);
  };

  useEffect(() => {
    const strUser = localStorage.getItem("user");
    const { password: _, ...data } = strUser ? JSON.parse(strUser) : {};
    if (!user.id && !user.name && !strUser) {
      setMessage("Loading...");
      return;
    }
    if (strUser && !user.name) {
      setUser({ ...data });
      navigate("/usermain");
    } else {
      setMessage("session expired");
    }
  }, []);


  return (
    <form style={{
      display: "flex",
      maxWidth: "400px",
      flexDirection: "column",
      gap: "0.5rem",
      alignItems: "end",
    }} onSubmit={handleSubmit(onSubmit)}>
      <h3>{type === "register" ? "Sign Up" : "Login"}</h3>

      {type === "login" ? (
        <>
          <RegularInput title="name or email">
            <input
              type="text"
              {...register("nameoremail", {
                required: "Name or Email is required",
                onChange: handleInputChange("nameoremail"),
              })}
            />
          </RegularInput>
          {showMessage && <ErrorSpan errorObj={errors.nameoremail} />}
        </>
      ) : (
        <>
          <RegularInput title="name">
            <input
              {...register("name", {
                required: "Name is required",
                onChange: handleInputChange("name"),
              })}
            />
          </RegularInput>
          {showMessage && <ErrorSpan errorObj={errors.name} />}

          <RegularInput title="email">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
                onChange: handleInputChange("email"),
              })}
            />
          </RegularInput>
          {showMessage && <ErrorSpan errorObj={errors.email} />}
        </>
      )}

      <PassInput register={register} clearErrors={clearErrors} />
      {showMessage && <ErrorSpan errorObj={errors.password} />}

      <hr style={{ margin: ".3rem 0", width: "100%" }} />

      {showMessage && message && message !== "session expired" && (
        <ErrorSpan errorObj={{ message }} />
      )}

      <input type="submit" value={type === "register" ? "Register" : "Login"} />
    </form>
  );
};

export default LogSign;
