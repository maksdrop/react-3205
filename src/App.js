import React, { useState } from "react";
import InputMask from "react-input-mask";
import "./app.scss";

let Http = null;

function App() {
  const [data, setData] = useState();
  const [form, setForm] = useState({ email: "", number: "" });
  const [error, setError] = useState({ email: true, number: false });
  const [preloader, setPreloader] = useState(false);
  
  function isValidEmail(email) {
    // eslint-disable-next-line
    return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
      email
    );
  }

  const changeEmail = (e) => {
    if (!isValidEmail(e.target.value)) {
      setError((error) => ({ ...error, email: "Email is invalid" }));
    } else {
      setError((error) => ({ ...error, email: false }));
    }

    setForm((form) => ({ ...form, email: e.target.value }));
  };

  const changePhone = (e) => {
    const value = e.target.value;

    const numberValue = value.replace(/\D/g, "");
    if (numberValue.length < 6) {
      setError((error) => ({ ...error, number: "Number is invalid" }));
    } else {
      setError((error) => ({ ...error, number: false }));
    }
    const formattedValue = numberValue.replace(/(\d{2})/g, "$1-");

    setForm((form) => ({ ...form, number: formattedValue }));
  };

  const fetchUsers = (e) => {
    e.preventDefault();
    setData([]);

    if (Http && Http.readyState !== 4) {
      Http.abort();
    }

    if (!error.email && !error.number) {
      setPreloader(true);
      Http = new XMLHttpRequest();
      let url = `/api?`;
      if (form.email) {
        url += `&email=${form.email}`;
      }
      if (form.number) {
        url += `&number=${form.number}`;
      }
      Http.open("GET", url);

      Http.onreadystatechange = () => {
        if (Http.readyState === 4 && Http.status === 200) {
          let result = JSON.parse(Http.responseText);
          if (result.length === 0) {
            setData(0)
          } else {
            setData([...result]);
          }
          setPreloader(false);
        }
      };

      Http.send();
    } else {
      return;
    }
  };

  return (
    <div className="app">
      <div className="container">
        <form className="form">
          <div className="form__email">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={form.email}
              onChange={changeEmail}
              placeholder="email"
              autoComplete="off"
              required
            />
            {error.email !== false ? <span className="form__email_error">{error.email}</span> : null }
          </div>
          <div className="form__number">
            <label htmlFor="number">Number</label>
            <InputMask
              type="text"
              id="number"
              value={form.number}
              onChange={changePhone}
              mask="99-99-99"
              maskChar=""
              placeholder="number"
              autoComplete="off"
            />
            {error.number !== false ? <span className="form__number_error">{error.number}</span> : null }
          </div>
          <button onClick={fetchUsers}>Поиск</button>
        </form>
        {
          preloader
          ?
          <span className="form__loader"></span>
          :
          data !== 0 && data?.length !== 0
          ?
          data?.map((item, i) => {
            return (
              <div className="form__result" key={i}>
                <div className="form__result_email">
                  <span>Email</span>
                  <span>{item.email}</span>
                </div>
                <div className="form__result_number">
                  <span>Number</span>
                  <span>{item.number}</span>
                </div>
              </div>
            );
          })
              :
              data === 0
              ?
                <div className="form__empty">Пользователей не найдено</div>
                :
                null
        }
      </div>
    </div>
  );
}

export default App;
