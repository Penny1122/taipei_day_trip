const sign = document.querySelector(".sign");
const signin = document.querySelector(".signin");
const signup = document.querySelector(".signup");
const signout = document.querySelector(".signout");
const goToSignUp = document.querySelector(".goToSignUp");
const goToSignIn = document.querySelector(".goToSignIn");
const close = document.querySelectorAll(".close");
const signButton = document.querySelector(".signButton");
const signInButton = document.querySelector(".signInButton");
const signupButton = document.querySelector(".signupButton");
const signInEmail = document.querySelector("#signInEmail");
const signInPassword = document.querySelector("#signInPassword");
const opacity = document.querySelector(".opacity");

function get() {
  let url = "/api/user/auth";
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }) //發送JSON格式資料給後端
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.data != null) {
        sign.classList.toggle("none");
        signout.classList.toggle("none");
      } else {
        sign.style.display = "block";
        signout.style.display = "none";
      }
      //   if (data["ok"]) {
      //     document.location.href = "/member";
      //   }
    });
}
get();

sign.addEventListener("click", function () {
  opacity.style.display = "block";
  signin.style.display = "block";
});
goToSignUp.addEventListener("click", function () {
  signin.style.display = "none";
  signup.style.display = "block";
});
goToSignIn.addEventListener("click", function () {
  signin.style.display = "block";
  signup.style.display = "none";
});
close.forEach((close) => {
  close.addEventListener("click", function () {
    signin.style.display = "none";
    signup.style.display = "none";
    opacity.style.display = "none";
  });
});

signInButton.addEventListener("click", function () {
  let email = document.querySelector("#signInEmail").value;
  let password = document.querySelector("#signInPassword").value;
  let url = "/api/user/auth";
  fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }), //發送JSON格式資料給後端
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data["ok"]) {
        sign.style.display = "none";
        signout.style.display = "block";
        signin.style.display = "none";
        opacity.style.display = "none";
      }
    });
});
signupButton.addEventListener("click", function () {
  let name = document.querySelector("#signUpName").value;
  let email = document.querySelector("#signUpEmail").value;
  let password = document.querySelector("#signUpPassword").value;
  let url = "/api/user";
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }), //發送JSON格式資料給後端
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //   if (data["ok"]) {
      //     document.location.href = "/member";
      //   }
    });
});

signout.addEventListener("click", function () {
  let url = "/api/user/auth";
  fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //   console.log(data);
      if (data["ok"]) {
        get();
        console.log("OK");
      }
    });
});
