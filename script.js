let player = 0;
let randomCountry;
let correctAnswer;
let options;
let fetchedData;
let maxCountry; // upper limit. depends on playing worldwide or europe.
const playerScores = [0, 0];
let btnOptions = document.querySelectorAll(".option");
let btnOptionsDiv = document.querySelector(".options");
const imgFlag = document.querySelector(".flag__img");
const answerCorrect = document.querySelector(".answer--correct");
const answerWrong = document.querySelector(".answer--wrong");
const btnNext = document.querySelector(".btn--next");
const btnPlayAgain = document.querySelector(".btn--again");
const player0Score = document.getElementById("score--0");
const player1Score = document.getElementById("score--1");
const winnerText = document.querySelector(".winner");
const winnerPlayer = document.querySelector(".player--winner");
const player0Name = document.getElementById("name--0");
const player1Name = document.getElementById("name--1");
const main = document.querySelector(".main");
const txtImgLoading = document.querySelector(".img-loading");
// *** selecting form elements ***///
const btnFormSubmit = document.querySelector(".form__btn");
const formPlayer0Name = document.getElementById("player--0-name");
const formPlayer1Name = document.getElementById("player--1-name");
const formContainer = document.querySelector(".form-container");
const form = document.querySelector(".form");
//////////////////////////////
const onFormSubmit = function (e) {
  if (!form.checkValidity()) {
    alert("Please fill all the areas.");
    return;
  }
  e.preventDefault();
  let selectedOption = document.querySelector(
    'input[name="user-selection"]:checked'
  );
  gameStarts(selectedOption);
};
const gameStarts = function (selectedOption) {
  formContainer.classList.add("hidden");
  main.classList.remove("hidden");
  player0Name.textContent = formPlayer0Name.value;
  player1Name.textContent = formPlayer1Name.value;
  init(selectedOption);
};
///////////////////////////////////////////////
const imgLoading = function () {
  imgFlag.classList.add("hidden");
  txtImgLoading.classList.remove("hidden");
};
const imgLoaded = function () {
  imgFlag.classList.remove("hidden");
  txtImgLoading.classList.add("hidden");
};
const clickOnCorrectAnswer = function (e) {
  answerCorrect.classList.remove("hidden");
  e.target.style.backgroundColor = "green";
  playerScores[player] = playerScores[player] + 5;
};
const clickOnWrongAnswer = function (e) {
  e.target.style.backgroundColor = "red";
  answerWrong.classList.remove("hidden");
  Array.from(e.target.parentElement.children)[
    correctAnswer
  ].style.backgroundColor = "green";
};
const playerWins = function () {
  hideCorrectAndWrong();
  winnerText.classList.remove("hidden");
  winnerPlayer.textContent = document.getElementById(
    `name--${player}`
  ).textContent;
  btnOptionsDiv.classList.add("hidden");
  imgFlag.classList.add("hidden");
  btnPlayAgain.classList.remove("hidden");
};
const hideCorrectAndWrong = function () {
  answerCorrect.classList.add("hidden");
  answerWrong.classList.add("hidden");
};
const updateScores = function () {
  if (player === 0) {
    player0Score.textContent = playerScores[0];
  } else {
    player1Score.textContent = playerScores[1];
  }
};
const changePlayer = function () {
  player === 0 ? (player = 1) : (player = 0);
};
const resetColorAndDisabled = function (options) {
  Array.from(options).forEach(function (o) {
    o.style.backgroundColor = "#ffe3e3";
    o.disabled = false;
  });
};
const nextOnClick = function (e) {
  imgLoading();
  selectRandomCountry(fetchedData);
  resetColorAndDisabled(options);
  if (player === 0) {
    btnOptionsDiv.parentNode.nextElementSibling.append(btnOptionsDiv);
  } else {
    btnOptionsDiv.parentNode.previousElementSibling.append(btnOptionsDiv);
  }
  changePlayer();
  hideCorrectAndWrong();
  btnNext.classList.add("hidden");
  document.querySelector(".player--0").classList.toggle("player--active");
  document.querySelector(".player--1").classList.toggle("player--active");
};
const optionOnClick = function (e, randomCountry) {
  if (e.target.classList.contains("option")) {
    if (e.target.textContent === randomCountry.name.common) {
      clickOnCorrectAnswer(e);
      if (playerScores[player] === 25) {
        playerWins();
        updateScores();
        return;
      }
      updateScores();
    } else {
      clickOnWrongAnswer(e);
    }
    options = e.target.parentElement.children;
    Array.from(options).forEach((o) => (o.disabled = true));
    btnNext.classList.remove("hidden");
  }
};
const selectRandomCountry = function (data) {
  const randomNumber = Math.round(Math.random() * maxCountry) + 1;
  randomCountry = data[randomNumber];
  imgFlag.src = randomCountry.flags?.png;
  let randomNumberForOptions = Math.round(Math.random() * maxCountry) + 1;
  // to fill other 3 options with random countries.
  let randomOptionCorrectAnswer = Math.round(Math.random() * 3);
  // to put the correct answer in a random option. from 0 to 3
  btnOptions.forEach(function (btn, index) {
    btn.textContent = data[randomNumberForOptions].name.common;
    randomNumberForOptions = Math.round(Math.random() * maxCountry) + 1;
    if (index === randomOptionCorrectAnswer) {
      btn.textContent = randomCountry.name.common;
      correctAnswer = index;
    }
  });
};
const getCountries = async function (selectedOption) {
  let link;
  if (selectedOption.value === "worldwide") {
    link = "https://restcountries.com/v3.1/all";
    maxCountry = 248;
  } else {
    link = "https://restcountries.com/v3.1/region/europe";
    maxCountry = 52;
  }
  try {
    const res = await fetch(link);
    if (!res.ok) {
      throw new Error("An error occured with the server...");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
    answerCorrect.textContent = `An error occurred. Please reload the page, or try again later`;
    answerCorrect.style.color = "red";
    answerCorrect.classList.remove("hidden");
  }
};
const init = async function (selectedOption) {
  fetchedData = await getCountries(selectedOption);
  selectRandomCountry(fetchedData);
  // imgFlag.classList.remove("hidden");
};

////////////////////////
btnNext.addEventListener("click", nextOnClick);
btnOptionsDiv.addEventListener("click", (e) =>
  optionOnClick(e, randomCountry, correctAnswer)
);
btnPlayAgain.addEventListener("click", () => location.reload());
btnFormSubmit.addEventListener("click", onFormSubmit);
imgFlag.addEventListener("load", imgLoaded);
