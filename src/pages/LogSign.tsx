import { ReactNode } from "react";
import {
  useForm,
  SubmitHandler,
  FieldError,
  UseFormRegister,
} from "react-hook-form";

type Inputs = {
  nameOrEmail?: string;
  name?: string;
  email?: string;
  password: string;
};

interface ErrorSpanProps {
  errorObj: FieldError | undefined;
}

const ErrorSpan = ({ errorObj }: ErrorSpanProps) => {
  if (errorObj)
    return <span style={{ color: "#e44", textAlign: "end" }}>{errorObj.message}</span>;
};

const RegularInput = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <label style={{display: "block"}}>
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
        max: 24,
        min: 5,
        maxLength: 24,
        pattern: {
          message:
            "The password must contain numbers, letters, capitalized and punctuation",
          value: /^[0-9]{8}[a-zA-Z._]/i,
        },
      })}
    />
  </RegularInput>
);

const LogSign = ({ type }: { type: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.clear();
    console.log({ data });
  };
  if (errors) console.log({ errors });

  if (type == "login")
    return (
      <form style={{display: "flex",  maxWidth:"400px", flexDirection:"column", gap: "0.5rem", alignItems: "end" }} onSubmit={handleSubmit(onSubmit)}>
        <h3>Login</h3>
        <RegularInput title="name or email">
          <input
            type="text"
            {...register("nameOrEmail", {
              required: "Name or Email is required",
            })}
          />
        </RegularInput>
        {<ErrorSpan errorObj={errors.nameOrEmail} />}

        <PassInput register={register} />
        <ErrorSpan errorObj={errors.password} />
        <br />

        <input type="submit" />
      </form>
    );

  if (type == "signup")
    return (
      <form  style={{display: "flex", maxWidth:"400px", flexDirection:"column", gap: "0.5rem", alignItems: "end" }} onSubmit={handleSubmit(onSubmit)}>
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
        <br />

        <input type="submit" />
      </form>
    );
};

export default LogSign;
