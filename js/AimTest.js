import * as app from "./App.js";

const aimTestButton = document.querySelector("#aimTestButton");
const AIM_RECORDS_KEY = "aim_records";

export let currentGameNumber = 0;
export let startTime, clickTime, missClicks;

// 에임 테스트 시작
function startAimTest() {
  app.testTitle.innerText = "에임 테스트";
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
  app.test.addEventListener("click", missClick);
}

// 화면의 상태에 따라 사용자 입력의 결과를 나타냄
function aimClick() {
  app.test.removeEventListener("click", aimClick);
  if (currentGameNumber >= app.testNumber) {
    app.test.removeEventListener("click", aimClick);
    app.test.removeEventListener("click", missClick);
    clickTime = new Date();
    const currentRecord = clickTime - startTime - 1400;
    app.resultTimes.push(currentRecord);
    currentGameNumber = 0;
    app.aimResultPage(AIM_RECORDS_KEY);
  } else {
    if (currentGameNumber === 0) app.test.innerText = "";
    setTarget();
    const currentRecord = startTime - clickTime;
    clickTime = new Date();
    if (currentGameNumber !== 1) {
      app.resultTimes.push(currentRecord);
    }
  }
}

// 화면의 랜덤한 위치에 타겟을 표시
function setTarget() {
  currentGameNumber += 1;
  app.progressState.innerText = `${currentGameNumber - 1} / ${app.testNumber}`;
  app.progressBar.value = parseInt(
    ((currentGameNumber - 1) / app.testNumber) * 100
  );
  let hasTarget = document.querySelector("#target");
  if (hasTarget !== null) {
    hasTarget.classList.add("fadeOut");
    setTimeout(() => {
      app.test.removeChild(hasTarget);
    }, 480);
  }
  const randomX = ((2 * Math.random() - 1) * (app.test.clientWidth - 100)) / 2;
  const randomY = ((2 * Math.random() - 1) * (app.test.clientHeight - 100)) / 2;
  const target = document.createElement("div");
  target.setAttribute("id", "target");
  target.setAttribute(
    "style",
    `position:relative; left:${randomX}px; top:${randomY}px`
  );
  const innerTarget1 = document.createElement("div");
  const innerTarget2 = document.createElement("div");
  const innerTarget3 = document.createElement("div");
  innerTarget1.setAttribute("id", "innerTarget1");
  innerTarget2.setAttribute("id", "innerTarget2");
  innerTarget3.setAttribute("id", "innerTarget3");
  target.appendChild(innerTarget1);
  target.appendChild(innerTarget2);
  target.appendChild(innerTarget3);
  setTimeout(() => {
    app.test.appendChild(target);
  }, 700);
  startTime = new Date() - 700;
  target.addEventListener("click", aimClick);
}

// 타겟이 아닌 빈 공간을 클릭했을 경우
function missClick() {
  missClicks += 1;
}

aimTestButton.addEventListener("click", startAimTest);
mainButton.addEventListener("click", () => {
  currentGameNumber = 0;
  app.test.removeEventListener("click", aimClick);
});
