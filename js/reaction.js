const reactionTestButton = document.querySelector("#reactionTestButton");
const testStart = document.querySelector("#testStart");
const reactionTest = document.querySelector("#reactionTest");
const reactionTestForm = document.querySelector("#reactionTestForm");

function startReactionRateTest() {
  // 테스트 선택 버튼 숨김
  testStart.classList.add("hidden");

  const testNumberInput = document.createElement("input");
  testNumberInput.setAttribute("id", "reactionTestNumber");
  testNumberInput.setAttribute("type", "number");
  testNumberInput.setAttribute("placeholder", "테스트 횟수를 입력해주세요");
  testNumberInput.setAttribute("required", "");
  testNumberInput.setAttribute("min", "1");

  const startButton = document.createElement("button");
  startButton.innerText = "테스트 시작";

  reactionTestForm.appendChild(testNumberInput);
  reactionTestForm.appendChild(startButton);
}

function setReactionTest(e) {
  e.preventDefault();

  const testNumberInput = document.querySelector("#reactionTestNumber");
  const testNumber = testNumberInput.value;

  reactionTestForm.classList.add("hidden");
  reactionTest.classList.add("reactionTestBox");
  reactionTest.innerText = "시작하려면 클릭하세요!";
  reactionTestStart(testNumber);
}

function reactionTestStart(num) {}

reactionTestButton.addEventListener("click", startReactionRateTest);
reactionTestForm.addEventListener("submit", setReactionTest);
