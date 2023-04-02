const main = document.querySelector(".main");
const reactionTestButton = document.querySelector("#reactionTestButton");
const testStart = document.querySelector("#testStart");
const reactionTest = document.querySelector("#reactionTest");
const progress = document.querySelector("#progress");
const progressState = document.querySelector("#progressState");
const progressBar = document.querySelector("#progressBar");
const mainButton = document.querySelector("#mainButton");
const RECORDS_KEY = "reaction_records";
const records = document.querySelector("#records");
const highRecords = document.querySelector("#highRecords");

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
  const currentRecord = clickTime - startTime;
  reactionTest.classList.add("timeResult");
  currentGameNum += 1;
  progressState.innerText = `${currentGameNum} / ${testNumber}`;
  progressBar.value = parseInt((currentGameNum / testNumber) * 100);
  reactionTest.innerText = `${currentGameNum}회 : ${currentRecord}ms\n계속하려면 클릭하세요`;
  resultTimes.push(currentRecord);
  saveRecords(currentRecord);
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
  showRecords();
}

// local storage에 기록 저장
function saveRecords(currentRecord) {
  if (localStorage.getItem(RECORDS_KEY) === null) {
    localStorage.setItem(RECORDS_KEY, "[]");
  }
  const recordArray = localStorage.getItem(RECORDS_KEY);
  const highRecord = JSON.parse(recordArray);
  highRecord.push(currentRecord);
  highRecord.sort((a, b) => a - b);
  if (highRecord.length > 10) highRecord.pop();
  localStorage.setItem(RECORDS_KEY, JSON.stringify(highRecord));
}

// 테스트 종료 후 저장된 기록 상위 10개를 보여줌
function showRecords() {
  records.classList.remove("hidden");
  const recordArray = localStorage.getItem(RECORDS_KEY);
  const highRecord = JSON.parse(recordArray);
  let result = "<ol>최고기록";
  highRecord.forEach((c) => (result += `<li>${c}ms</li>`));
  result += "</ol>";
  highRecords.innerHTML = result;
  resetRecords();
}

// 기록 초기화
function resetRecords() {
  const resetRecordButton = document.createElement("button");
  resetRecordButton.innerText = "기록 초기화";
  resetRecordButton.setAttribute("id", "resetRecord");
  highRecords.appendChild(resetRecordButton);

  resetRecordButton.addEventListener("click", () => {
    localStorage.removeItem(RECORDS_KEY);
  });
}

// 테스트를 초기화하고 메인 화면으로 돌아감
function resetTest() {
  testStart.classList.remove("hidden");
  progress.classList.add("hidden");
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
  highRecords.innerHTML = "";
  records.classList.add("hidden");
  reactionTest.removeEventListener("click", resetTest);
  reactionTest.removeEventListener("click", testClick);
}

reactionTestButton.addEventListener("click", startReactionTimeTest);
mainButton.addEventListener("click", resetTest);
