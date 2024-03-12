const selectLang = document.querySelectorAll("select");
const converter_icon = document.querySelector(".converter_icon");
const from_text = document.querySelector("#text");
const to_text = document.querySelector("#translate");
const converter_button = document.querySelector(".converter_button");
const toggle_button = document.querySelector(".toggle_button");
const copy_icon = document.querySelector(".copy_icon");
const toast = document.getElementById("toast");

let autoTranslateEnabled = false;

function toggleAutoTranslate() {
    autoTranslateEnabled = !autoTranslateEnabled;
    if (autoTranslateEnabled) {
        toggle_button.textContent = "🔴 Disable Auto Translate";
        translateText();
    } else {
        toggle_button.textContent = "🟢 Enable Auto Translate";
    }
}

selectLang.forEach((lang, id) => {
    for (let cc in countries) {
        let selected = id === 0 ? (cc === "en-GB" ? "selected" : "") : cc === "bn-IN" ? "selected" : "";
        let option = `<option ${selected} value="${cc}">${countries[cc]}</option>`;
        lang.insertAdjacentHTML("beforeend", option);
    }
});

converter_icon.addEventListener("click", () => {
    let tempText = from_text.value;
    let tempLang = selectLang[0].value;
    from_text.value = to_text.value;
    to_text.value = tempText;
    selectLang[0].value = selectLang[1].value;
    selectLang[1].value = tempLang;
});

function copyTranslatedText() {
    to_text.select();
    document.execCommand("copy");

    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}


const translateText = () => {
    let text = from_text.value.trim(),
        translateFrom = selectLang[0].value,
        translateTo = selectLang[1].value;
    if (!text) return;
    to_text.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
            to_text.value = data.responseData.translatedText;
            data.matches.forEach((data) => {
                if (data.id === 0) {
                    to_text.value = data.translation;
                }
            });
            to_text.setAttribute("placeholder", "Translation");
        });
};

converter_button.addEventListener("click", translateText);

from_text.addEventListener("input", () => {
    if (autoTranslateEnabled) {
        translateText();
    }
});
