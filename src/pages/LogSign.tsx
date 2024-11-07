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

const ErrorSpan = ({ errorObj }: ErrorSpanProps) => {
  if (errorObj)
    return (
      <span style={{ color: "#e44", textAlign: "end" }}>
        {errorObj.message}
      </span>
    );
};

const RegularInput = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <label style={{ display: "block" }}>
      {title} -{"> "}
      {children}
    </label>
  );
};

const PassInput = ({ register }: { register: UseFormRegister<Inputs> }) => (
  <RegularInput title="password">
    <input
      type="password"
      {...register("password", {
        required: "Password is required",
        minLength: {
          value: 8,
          message: "The password must contain at least 8 characters",
        },
        maxLength: {
          value: 24,
          message: "The password must contain at most 24 characters",
        },
        pattern: {
          message:
            "The password must contain at least one lowercase letter, one uppercase letter, one number, and one punctuation symbol",
          value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,24}/,
        },
      })}
    />
  </RegularInput>
);

const LogSign = ({ type }: { type: "login" | "register" }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const { user, setUser } = useUserContext();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
<<<<<<< HEAD
<<<<<<< HEAD
      console.log({ data })
=======
      console.log({data})
>>>>>>> 1378e8c8c7db7145b91c9d131241cafd6b144ef1
=======
      console.log({data})
>>>>>>> 1378e8c8c7db7145b91c9d131241cafd6b144ef1
      const datares = await FrontFetch.caller(
        { name: "player", method: "post", typeMethod: type },
        data
      );
<<<<<<< HEAD
<<<<<<< HEAD
      console.log({ datares })
=======
      console.log({datares})
>>>>>>> 1378e8c8c7db7145b91c9d131241cafd6b144ef1
=======
      console.log({datares})
>>>>>>> 1378e8c8c7db7145b91c9d131241cafd6b144ef1
      if (!datares.error) {
        localStorage.setItem("user", JSON.stringify(data))
        setUser(data)
        if (type == "register") { navigate("/pixel") } else navigate("/usermain");
        return;
      }
      setMessage(datares.error);
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    const getUserFromSession = async () => {

      const strUser = localStorage.getItem("user");
      const { password: undefined, ...data } = strUser ? JSON.parse(strUser) : {}
      if (strUser && !user.name) {
        setUser(data);
        navigate("/usermain");
        return;
      } else {
        setMessage("session expired");
      }
    };
    if (!user.id && type == "register") getUserFromSession();
  }, []);

  if (type == "login")
    return (
      <form
        style={{
          display: "flex",
          maxWidth: "400px",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "end",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>Login</h3>
        <RegularInput title="name or email">
          <input
            type="text"
            {...register("nameoremail", {
              required: "Name or Email is required",
            })}
          />
        </RegularInput>
        {<ErrorSpan errorObj={errors.nameoremail} />}

        <PassInput register={register} />
        <ErrorSpan errorObj={errors.password} />
        <hr style={{ margin: ".3rem 0", width: "100%" }} />

        {message && <ErrorSpan errorObj={{ message }} />}
        <input type="submit" />
      </form>
    );

  if (type == "register")
    return (
      <form
        style={{
          display: "flex",
          maxWidth: "400px",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "end",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>Sign Up</h3>
        <RegularInput title="name">
          <input {...register("name", { required: "Name is required" })} />
        </RegularInput>
        {<ErrorSpan errorObj={errors.name} />}

        <RegularInput title="email">
          <input
            {...register("email", {
              required: "Email  is required",
              pattern: { value: /^\S+@\S+$/i, message: "Need email schema" },
            })}
          />
        </RegularInput>
        <ErrorSpan errorObj={errors.email} />

        <PassInput register={register} />
        <ErrorSpan errorObj={errors.password} />
        <hr style={{ margin: ".3rem 0", width: "100%" }} />

        {message && message !== "session expired or nonexistent" && (
          <ErrorSpan errorObj={{ message }} />
        )}
        <input type="submit" />
      </form>
    );
};

export default LogSign;
