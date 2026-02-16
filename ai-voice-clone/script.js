const API_KEY = "sk_b1abd3bfdb5510257f07f8481648d58001d1906d928f0853";
const API_BASE = "https://api.elevenlabs.io/v1";
const LOCAL_API_BASE = "http://localhost:5000/api";

async function cloneVoice() {
    const fileInput = document.getElementById("voiceFile");
    const status = document.getElementById("cloneStatus");

    if (!fileInput.files.length) {
        alert("Please upload a voice sample.");
        return;
    }

    const formData = new FormData();
    formData.append("name", "My Custom Voice");
    formData.append("files", fileInput.files[0]);

    status.textContent = "Cloning voice... Please wait.";

    try {
        const response = await fetch(`${LOCAL_API_BASE}/clone`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        console.log('Clone Voice API response:', result);
        status.textContent = `Voice cloned successfully! Voice ID: ${result.voice_id}`;
    } catch (error) {
        console.error(error);
        status.textContent = "Error cloning voice.";
    }
}

async function generateSpeech() {
    const text = document.getElementById("textInput").value;
    const voiceId = document.getElementById("voiceId").value;
    const audioPlayer = document.getElementById("audioPlayer");

    if (!text || !voiceId) {
        alert("Please enter text and Voice ID.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/text-to-speech/${voiceId}`, {
            method: "POST",
            headers: {
                "xi-api-key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });

        const blob = await response.blob();
        const audioURL = URL.createObjectURL(blob);
        audioPlayer.src = audioURL;
    } catch (error) {
        console.error(error);
        alert("Error generating speech.");
    }
}

function displaySelectedFile() {
  const fileInput = document.getElementById('voiceFile');
  const fileNameDisplay = document.getElementById('selectedFileName');
  if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = fileInput.files[0].name;
  } else {
    fileNameDisplay.textContent = '';
  }
}