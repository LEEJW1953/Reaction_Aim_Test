const main = document.querySelector(".main");
const reactionTestButton = document.querySelector("#reactionTestButton");
const testStart = document.querySelector("#testStart");
const reactionTest = document.querySelector("#reactionTest");
const progress = document.querySelector("#progress");
const progressState = document.querySelector("#progressState");
const progressBar = document.querySelector("#progressBar");

let currentGameNum = 0;
let changeState;
let startTime, clickTime, avgTime, testNumber;
let resultTimes = [];

// 테스트 횟수를 입력받는 form 생성
function startReactionTimeTest() {
  testStart.classList.add("hidden");
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

// 테스트 시작 페이지 구성
function setReactionTest(e) {
  e.preventDefault();
  const testNumberInput = document.querySelector("#reactionTestNumber");
  testNumber = Number(testNumberInput.value);
  progress.classList.remove("hidden");
  progressState.innerText = `0 / ${testNumber}`;
  reactionTest.classList.add("reactionTestBox", "startTest");
  reactionTest.innerText = "시작하려면 클릭하세요!";
  reactionTest.addEventListener("click", testClick);
}

// 화면의 상태에 따라 사용자 입력의 결과를 나타냄
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

// 대기 상태의 경우
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

// 사용자의 입력이 너무 빨랐을 경우
function tooFast() {
  clearTimeout(changeState);
  reactionTest.innerText = "너무 빨랐습니다!";
  reactionTest.classList.replace("getReady", "startTest");
}

// 화면의 색이 바뀌었을 경우
function clickNow() {
  clickTime = new Date();
  reactionTest.classList.add("timeResult");
  currentGameNum += 1;
  progressState.innerText = `${currentGameNum} / ${testNumber}`;
  progressBar.value = parseInt((currentGameNum / testNumber) * 100);
  reactionTest.innerText = `${currentGameNum}회 : ${
    clickTime - startTime
  }ms\n계속하려면 클릭하세요`;
  resultTimes.push(clickTime - startTime);
  reactionTest.classList.replace("clickNow", "startTest");
}

// 테스트가 완료되었을 경우
function resultPage() {
  reactionTest.classList.remove("startTest");
  avgTime = parseInt(
    resultTimes.reduce((acc, cur) => acc + cur, 0) / resultTimes.length
  );
  reactionTest.innerText = `${currentGameNum}회 : ${
    clickTime - startTime
  }ms\n${testNumber}회의 평균 반응속도는 ${avgTime}ms 입니다\n메인화면으로 돌아가려면 클릭하세요`;
  reactionTest.addEventListener("click", resetTest);
  progress.classList.add("hidden");
}

// 테스트를 초기화하고 메인 화면으로 돌아감
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
  progressBar.value = 0;
  reactionTest.removeEventListener("click", resetTest);
  reactionTest.removeEventListener("click", testClick);
}

reactionTestButton.addEventListener("click", startReactionTimeTest);
