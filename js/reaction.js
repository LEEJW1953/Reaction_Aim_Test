const main = document.querySelector(".main");
const reactionTestButton = document.querySelector("#reactionTestButton");
const testStart = document.querySelector("#testStart");
const reactionTest = document.querySelector("#reactionTest");
// const reactionTestForm = document.querySelector("#reactionTestForm");

let currentGameNum = 0;
let changeState;
let startTime, clickTime, avgTime, testNumber;
let resultTimes = [];

function startReactionTimeTest() {
  testStart.classList.add("hidden");
  // reactionTestForm.classList.remove("hidden");
  const reactionTestForm = document.createElement("form");
  reactionTestForm.setAttribute("id", "reactionTestForm");

  const testNumberInput = document.createElement("input");
  testNumberInput.setAttribute("id", "reactionTestNumber");
  testNumberInput.setAttribute("type", "number");
  testNumberInput.setAttribute("placeholder", "테스트 횟수를 입력해주세요");
  testNumberInput.setAttribute("required", "");
  testNumberInput.setAttribute("min", "1");

  const startButton = document.createElement("button");
  startButton.innerText = "테스트 시작";

  reactionTest.appendChild(reactionTestForm);
  reactionTestForm.innerHTML = "<h1>테스트 횟수를 입력해주세요</h1>";
  reactionTestForm.appendChild(testNumberInput);
  reactionTestForm.appendChild(startButton);
  reactionTestForm.addEventListener("submit", setReactionTest);
}

function setReactionTest(e) {
  e.preventDefault();
  const testNumberInput = document.querySelector("#reactionTestNumber");
  testNumber = Number(testNumberInput.value);
  reactionTest.classList.add("reactionTestBox", "startTest");
  reactionTest.innerText = "시작하려면 클릭하세요!";
  reactionTestStart();
}

function reactionTestStart() {
  reactionTest.addEventListener("click", testClick);
}

function testClick() {
  if (reactionTest.classList.contains("startTest")) {
    getReady();
  } else if (reactionTest.classList.contains("getReady")) {
    tooFast();
  } else if (reactionTest.classList.contains("clickNow")) {
    clickNow();
    if (currentGameNum === testNumber) {
      resultPage();
    }
  }
}

function getReady() {
  reactionTest.innerText = "기다리세요...";
  reactionTest.classList.replace("startTest", "getReady");
  reactionTest.classList.remove("timeResult");
  changeState = setTimeout(() => {
    startTime = new Date();
    reactionTest.classList.replace("getReady", "clickNow");
    reactionTest.innerText = "클릭하세요!";
  }, parseInt(1000 + Math.random() * 5000));
}

function tooFast() {
  clearTimeout(changeState);
  reactionTest.innerText = "너무 빨랐습니다!";
  reactionTest.classList.replace("getReady", "startTest");
}

function clickNow() {
  clickTime = new Date();
  reactionTest.classList.add("timeResult");
  currentGameNum += 1;
  reactionTest.innerText = `${currentGameNum}회 : ${
    clickTime - startTime
  }ms\n계속하려면 클릭하세요`;
  resultTimes.push(clickTime - startTime);
  reactionTest.classList.replace("clickNow", "startTest");
}

function resultPage() {
  reactionTest.classList.remove("startTest");
  avgTime = parseInt(
    resultTimes.reduce((acc, cur) => acc + cur, 0) / resultTimes.length
  );
  reactionTest.innerText = `${testNumber}회의 평균 반응속도는 ${avgTime}ms 입니다\n메인화면으로 돌아가려면 클릭하세요`;
  reactionTest.addEventListener("click", resetTest);
}

function resetTest() {
  testStart.classList.remove("hidden");
  reactionTest.classList.remove(
    "reactionTestBox",
    "startTest",
    "getReady",
    "timeResult"
  );
  reactionTest.innerText = "";
  currentGameNum = 0;
  resultTimes = [];
  reactionTest.removeEventListener("click", resetTest);
  reactionTest.removeEventListener("click", testClick);
}

reactionTestButton.addEventListener("click", startReactionTimeTest);
