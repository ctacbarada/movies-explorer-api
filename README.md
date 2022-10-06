# Movies explorer

## About

This movie search web application is my last final project in the course. It contains a <a href="https://github.com/ctacbarada/movies-explorer-frontend">`frontend`</a> and <a href="https://github.com/ctacbarada/movies-explorer-api">`backend`</a>. It's possible register users, find movies and save them in your favorites.

The most dificl parts of this project it was sorting films according to the specified parameters in the search with a switch to short films and saving the state of the search when reloading the page or switching to another page.

## Frontend

The project is written in `HTML`, `CSS`, `JSX` using `React Fraemwork`. Data came from the backend and was sent to it through a class components using `RestAPI`.

One of the goals of this project was to do form validation with React. I used <a href="https://react-hook-form.com/">react hook form</a> library:

```JavaScript
import { useForm } from "react-hook-form";
```

When you can connect register, watch, errors methods and handleSubmit function.

```JavaScript
const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm({
  mode: "onBlur",
});

const [registrationName, registrationEmail, registrationPassword] = watch([
  "registrationName",
  "registrationEmail",
  "registrationPassword",
]);

function onSubmit() {
  handleRegister(registrationName, registrationEmail, registrationPassword);
}
```

They monitor the text input fields and if they do not match the pattern, they will give an error

```JavaScript
<input
  {...register("registrationEmail", {
    required: "Введите e-mail",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Email должен быть с @",
    },
  })}
  className="register__input"
  type="text"
  placeholder="E-mail"
/>
<span className="register__errors">
  {errors?.registrationEmail?.message}
</span>
```

## Backend

I used `Node.js` witch `Express Fraemwork` and `MongoDB` database to process and save data.

## Deploy

The project was build on the AWS cloud using `Nginx` and `PM2` to resume work in crash case.

I used <b>React</b> framework and <b>MongoDB</b> data base.

You can run both use:

```
npm run start
```

![Preview](https://github.com/ctacbarada/movies-explorer-frontend/blob/main/src/images/Screenshot%202022-09-09%20at%2022.51.59.png?raw=true)
![Preview](https://github.com/ctacbarada/movies-explorer-frontend/blob/main/src/images/Screenshot%202022-09-09%20at%2022.52.30.png?raw=true)
![Preview](https://github.com/ctacbarada/movies-explorer-frontend/blob/main/src/images/Screenshot%202022-09-09%20at%2022.52.38.png?raw=true)
