const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const selectTags = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

selectTags.forEach((tag, id) => {
  for (const countryCode in countries) {
    const selected =
      id === 0
        ? countryCode === "en-GB"
          ? "selected"
          : ""
        : countryCode === "hi-IN"
        ? "selected"
        : "";
    const option = `<option ${selected} value="${countryCode}">${countries[countryCode]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  let tempLang = selectTags[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

fromText.addEventListener("input", () => {
  if (!fromText.value.trim()) {
    toText.value = "";
  }
});

translateBtn.addEventListener("click", () => {
  const text = fromText.value.trim();
  const translateFrom = selectTags[0].value;
  const translateTo = selectTags[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const translation = data.responseData.translatedText;
      toText.value = translation;
      data.matches.forEach(match => {
        if (match.id === 0) {
          toText.value = match.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach(icon => {
  icon.addEventListener("click", ({ target }) => {
    const text = target.id === "from" ? fromText.value : toText.value;
    const lang = target.id === "from" ? selectTags[0].value : selectTags[1].value;
    if (!text.trim()) return;
    if (target.classList.contains("fa-copy")) {
      navigator.clipboard.writeText(text);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  });
});
