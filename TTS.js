// Define variables and select DOM elements
const textarea = document.querySelector("textarea");
const voiceList = document.querySelector("select");
const speechBtn = document.querySelector("button");

// Initialize speech synthesis and set initial speaking state
let synth = window.speechSynthesis;
let isSpeaking = false;

// Call function to populate voice list with available voices
populateVoiceList();
function populateVoiceList() {
  const voices = synth.getVoices();
  for (const voice of voices) {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = voice.name;
    voiceList.appendChild(option);
  }
}

// Update voice list when voices change
synth.addEventListener("voiceschanged", populateVoiceList);

// Function to convert text to speech
function textToSpeech(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = voiceList.value;
  const voices = synth.getVoices();
  for (const voice of voices) {
    if (voice.name === selectedVoice) {
      utterance.voice = voice;
    }
  }
  synth.speak(utterance);
}

// Event listener for speech button click
speechBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const text = textarea.value.trim();
  if (text) {
    if (synth.speaking) {
      // If speaking, pause or resume speech depending on current state
      if (synth.paused) {
        synth.resume();
        isSpeaking = false;
        speechBtn.innerText = "Pause Speech";
      } else {
        synth.pause();
        isSpeaking = true;
        speechBtn.innerText = "Resume Speech";
      }
    } else {
      // If not speaking, convert text to speech
      textToSpeech(text);
      isSpeaking = true;
      speechBtn.innerText = "Pause Speech";
    }
  }
});
