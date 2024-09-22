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
    return <span style={{ color: "#e44" }}>{errorObj.message}</span>;
};

const PassInput = ({ register }: { register: UseFormRegister<Inputs> }) => (
  <fieldset>
    <legend>password</legend>
    <input
      type="password"
      {...register("password", {
        required: "Password is required",
        max: 24,
        min: 5,
        maxLength: 24,
        pattern: {
          message:
            "the password must contain numbers, letters, capitalized and punctuation",
          value: /^[0-9]{8}[a-zA-Z._]/i,
        },
      })}
    />
  </fieldset>
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Login</h3>
        <fieldset>
          <legend>name or email</legend>
          <input
            type="text"
            {...register("nameOrEmail", {
              required: "Name or Email is required",
            })}
          />
        </fieldset>
        {<ErrorSpan errorObj={errors.nameOrEmail} />}

        <PassInput register={register} />
        <ErrorSpan errorObj={errors.password} />
        <br />

        <input type="submit" />
      </form>
    );

  if (type == "signup")
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Sign Up</h3>
        <fieldset>
          <legend>name</legend>
          <input {...register("name", { required: "Name is required" })} />
        </fieldset>
        {<ErrorSpan errorObj={errors.name} />}

        <fieldset>
          <legend>email</legend>
          <input
            {...register("email", {
              required: "Email  is required",
              pattern: { value: /^\S+@\S+$/i, message: "Need email schema" },
            })}
          />
        </fieldset>
        <ErrorSpan errorObj={errors.email} />

        <PassInput register={register} />
        <ErrorSpan errorObj={errors.password} />
        <br />

        <input type="submit" />
      </form>
    );
};

export default LogSign;
