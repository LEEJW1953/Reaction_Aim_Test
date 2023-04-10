import * as rt from "./ReactionTest.js";
import * as at from "./AimTest.js";

export const testTitle = document.querySelector(".main").querySelector("h1");
export const testStart = document.querySelector("#testStart");
export const test = document.querySelector("#test");
export const mainButton = document.querySelector("#mainButton");
export const progress = document.querySelector("#progress");
export const progressState = document.querySelector("#progressState");
export const progressBar = document.querySelector("#progressBar");
export let avgTime, testNumber;
export let resultTimes = [];
let accuracy;
const records = document.querySelector("#records");
const highRecords = document.querySelector("#highRecords");

// 테스트 횟수를 입력받는 form 생성
export function startTest() {
  testStart.classList.add("hidden");
  const testForm = document.createElement("form");
  testForm.setAttribute("id", "testForm");

  const testNumberInput = document.createElement("input");
  testNumberInput.setAttribute("id", "testNumber");
  testNumberInput.setAttribute("type", "number");
  testNumberInput.setAttribute("placeholder", "테스트 횟수를 입력해주세요");
  testNumberInput.setAttribute("required", "");
  testNumberInput.setAttribute("min", "5");

  const startButton = document.createElement("button");
  startButton.setAttribute("id", "startButton");
  startButton.innerText = "테스트 시작";

  const mainButton = document.createElement("button");
  mainButton.setAttribute("id", "mainButton");
  mainButton.innerText = "메인메뉴";

  test.appendChild(testForm);
  testForm.innerHTML = "<h1>테스트 횟수를 입력해주세요</h1>";
  testForm.appendChild(testNumberInput);
  testForm.appendChild(startButton);
  testForm.appendChild(mainButton);
}

// progress bar 구성
export function setProgress() {
  const testNumberInput = document.querySelector("#testNumber");
  testNumber = Number(testNumberInput.value);
  progress.classList.remove("hidden");
  progressState.innerText = `0 / ${testNumber}`;
}

// 반응속도 테스트가 완료되었을 경우
export function reactionResultPage(key) {
  test.classList.remove("startTest");
  avgTime = parseInt(
    resultTimes.reduce((acc, cur) => acc + cur, 0) / resultTimes.length
  );
  test.innerText = `${testNumber}회 : ${
    rt.clickTime - rt.startTime
  }ms\n${testNumber}회의 평균 반응속도는 ${avgTime}ms 입니다\n메인화면으로 돌아가려면 더블클릭하세요`;
  test.addEventListener("dblclick", resetTest);
  progress.classList.add("hidden");
  showRecords(key);
}

// 에임 테스트가 완료되었을 경우
export function aimResultPage(key) {
  const target = document.querySelector("#target");
  if (target !== null) test.removeChild(target);
  avgTime = parseInt(
    resultTimes.reduce((acc, cur) => acc + cur, 0) / resultTimes.length
  );
  accuracy = parseInt(
    ((testNumber / (testNumber + at.missClicks)) * 100).toFixed(2)
  );
  test.innerText = `${testNumber}회의 평균 반응속도는 ${avgTime}ms 입니다\n정확도는 ${accuracy}% 입니다\n메인화면으로 돌아가려면 더블클릭하세요`;
  test.addEventListener("dblclick", resetTest);
  progress.classList.add("hidden");
  saveRecords(avgTime, key);
  showRecords(key);
}

// local storage에 기록 저장
export function saveRecords(currentRecord, key) {
  if (currentRecord === NaN) return;
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, "[]");
  }
  const recordArray = localStorage.getItem(key);
  const highRecord = JSON.parse(recordArray);
  if (key === "aim_records") {
    highRecord.push([accuracy, currentRecord]);
    highRecord.sort((a, b) => {
      if (a[0] === b[0]) {
        return a[1] - b[1];
      } else {
        return b[0] - a[0];
      }
    });
  } else {
    highRecord.push(currentRecord);
    highRecord.sort((a, b) => a - b);
  }
  if (highRecord.length > 10) highRecord.pop();
  localStorage.setItem(key, JSON.stringify(highRecord));
}

// 테스트 종료 후 저장된 기록 상위 10개를 보여줌
export function showRecords(key) {
  records.classList.remove("hidden");
  const recordArray = localStorage.getItem(key);
  const highRecord = JSON.parse(recordArray);
  let result = "<ol>최고기록";
  if (key === "aim_records") {
    highRecord.forEach((c) => (result += `<li>${c[0]}%, ${c[1]}ms</li>`));
  } else {
    highRecord.forEach((c) => (result += `<li>${c}ms</li>`));
  }
  result += "</ol>";
  highRecords.innerHTML = result;
  resetRecords(key);
}

// 기록 초기화
export function resetRecords(key) {
  const resetRecordButton = document.createElement("button");
  resetRecordButton.innerText = "기록 초기화";
  resetRecordButton.setAttribute("id", "resetRecord");
  highRecords.appendChild(resetRecordButton);
  resetRecordButton.addEventListener("click", () => {
    localStorage.removeItem(key);
    highRecords.innerHTML =
      "<style:'padding: 30px 0 30px 70px font-size: 20px font-weight: bold line-height: 30px'></style:>기록 초기화!";
  });
}

// 테스트를 초기화하고 메인 화면으로 돌아감
export function resetTest(e) {
  testTitle.innerText = "반응속도 & 에임 테스트";
  e.preventDefault();
  testStart.classList.remove("hidden");
  progress.classList.add("hidden");
  test.classList.remove(
    "reactionTestBox",
    "aimTestBox",
    "startTest",
    "getReady",
    "clickNow",
    "timeResult"
  );
  test.innerText = "";
  resultTimes.length = 0;
  progressBar.value = 0;
  clearTimeout(rt.changeState);
  highRecords.innerHTML = "";
  records.classList.add("hidden");
  test.removeEventListener("dblclick", resetTest);
  test.removeEventListener("click", rt.reactionClick);
  test.removeEventListener("click", at.aimClick);
  test.removeEventListener("click", at.missClick);
}

mainButton.addEventListener("click", resetTest);
