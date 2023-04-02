import * as app from "./App.js";
// import { resetTest } from "./ReactionTest.js";

const aimTestButton = document.querySelector("#aimTestButton");
const AIM_RECORDS_KEY = "aim_records";

export let missClicks;
export let currentGameNumber = 0;
export let startTime, clickTime;

// 에임 테스트 시작
function startAimTest() {
  app.startTest();
  const mainButton = document.querySelectorAll("#mainButton")[1];
  const testForm = document.querySelector("#testForm");
  mainButton.addEventListener("click", app.resetTest);
  testForm.addEventListener("submit", setAimTest);
}

// 테스트 시작 페이지 구성
function setAimTest(e) {
  e.preventDefault();
  app.setProgress();
  missClicks = -app.testNumber;
  app.test.classList.add("aimTestBox");
  app.test.innerText = "시작하려면 클릭하세요!";
  app.test.addEventListener("click", aimClick);
}

// function aimClick() {
//   let target = document.querySelector("#target");
//   if (target === null) {
//     app.test.removeEventListener("click", aimClick);
//     app.test.addEventListener("click", missClick);
//     app.test.innerText = "";
//     setTarget();
//     target = document.querySelector("#target");
//     target.addEventListener("click", aimClick);
//   } else {
//     target.addEventListener("click", aimClick);

//     const currentRecord = startTime - clickTime;
//     clickTime = new Date();
//     app.resultTimes.push(currentRecord);
//     app.saveRecords(currentRecord, AIM_RECORDS_KEY);
//     console.log(currentRecord, app.resultTimes);

//     // if (target.classList.contains("startTest")) {
//     setTarget();
//     // } else if (target.classList.contains("clickNow")) {
//     // clickNow();
//     if (currentGameNumber === app.testNumber) {
//       target.removeEventListener("click", aimClick);
//       app.test.removeEventListener("click", missClick);
//       currentGameNumber = 0;
//       app.aimResultPage(AIM_RECORDS_KEY);
//     }
//   }
// }

// 화면의 상태에 따라 사용자 입력의 결과를 나타냄
function aimClick() {
  app.test.removeEventListener("click", aimClick);
  console.log(currentGameNumber);
  // if (currentGameNumber === app.testNumber) {
  //   app.test.removeEventListener("click", aimClick);
  //   app.test.removeEventListener("click", missClick);
  //   document.querySelector("#target").removeEventListener("click", aimClick);
  //   const currentRecord = startTime - clickTime;
  //   clickTime = new Date();
  //   app.resultTimes.push(currentRecord);
  //   app.saveRecords(currentRecord, AIM_RECORDS_KEY);
  //   console.log(currentRecord, app.resultTimes);
  //   currentGameNumber = 0;
  //   app.aimResultPage(AIM_RECORDS_KEY);
  // } else {
    app.test.innerText = "";
    setTarget();
    const currentRecord = startTime - clickTime;
    clickTime = new Date();
    if (currentGameNumber !== 1) app.resultTimes.push(currentRecord);
    app.saveRecords(currentRecord, AIM_RECORDS_KEY);
    console.log(currentRecord, app.resultTimes);
    app.test.addEventListener("click", missClick);
    document.querySelector("#target").addEventListener("click", aimClick);
  // }
}

// 화면에 타겟을 표시
function setTarget() {
  currentGameNumber += 1;
  app.progressState.innerText = `${currentGameNumber - 1} / ${app.testNumber}`;
  app.progressBar.value = parseInt(
    ((currentGameNumber - 1) / app.testNumber) * 100
  );
  startTime = new Date();
  let hasTarget = document.querySelector("#target");
  if (hasTarget !== null) app.test.removeChild(hasTarget);
  const randomX =
    ((Math.random() - Math.random()) * (app.test.clientWidth - 100)) / 2;
  const randomY =
    ((Math.random() - Math.random()) * (app.test.clientHeight - 100)) / 2;
  const target = document.createElement("div");
  target.setAttribute("id", "target");
  target.setAttribute(
    "style",
    `transform: translate(${randomX}px, ${randomY}px)`
  );
  app.test.appendChild(target);
  // target.addEventListener("click", aimClick);
}

// 타겟이 아닌 빈 공간을 클릭했을 경우
function missClick() {
  missClicks += 1;
}

aimTestButton.addEventListener("click", startAimTest);
