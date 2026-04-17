fetch("data/folklore_dances.json")
  .then((response) => response.json())
  .then((data) => createPage(data))
  .catch((err) => console.error(err));

// Проверка дали приложението е отворено на някое от следните iOS устройства
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

let audio = new Audio();

document.getElementById("info-box").style.display = "none";
document.getElementById("audio-box").style.display = "none";
document.getElementById("origin").style.display = "none";
document.getElementById("characteristics").style.display = "none";
document.getElementById("dancers").style.display = "none";
document.getElementById("forms-and-rotation").style.display = "none";
document.getElementById("body-orientation-direction-legs-moves").style.display =
  "none";
document.getElementById("hands-position-and-moves").style.display = "none";
document.getElementById("shouts").style.display = "none";
document.getElementById("sources").style.display = "none";

function createPage(data) {
  // ----- Определяне на общия брой записи за танци за всички години в json обекта -----
  const totalNumOfDances = Object.values(data).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  const mainMessage = document.getElementById("main-message");
  mainMessage.style.whiteSpace = "pre-line";
  mainMessage.textContent = `Чуй, виж и се информирай
  за показаните ни 
  през ${Object.keys(data).length}-те години
   ${totalNumOfDances} хорá и техни варианти!`;

  console.log(data);

  const container = document.getElementById("dances-container");

  const years = Object.keys(data).sort();

  years.forEach((year) => {
    const yearSection = document.createElement("section");
    // ----- Параграф за годината -----
    const yearParagraph = document.createElement("p");
    yearParagraph.textContent = `~ ~ ~ ${year} - ${data[year].length} броя ~ ~ ~`;
    yearParagraph.className = "year-paragraph";
    yearSection.appendChild(yearParagraph);

    const ol = document.createElement("ol");
    // ol.start = 1;

    data[year].forEach((dance) => {
      // ----- Ред за всеки танц с име и бутони -----
      const li = document.createElement("li");

      // ----- Име на танца -----
      const nameSpan = document.createElement("span");
      nameSpan.textContent = dance.name + " ";
      li.appendChild(nameSpan);

      // ----- Брой на аудиофайловете за танца -----
      const numAudiosSpan = document.createElement("span");
      numAudiosSpan.className = "num-of-audios";
      numAudiosSpan.textContent = dance.audio_files.length;
      li.appendChild(numAudiosSpan);

      // --- Бутон за аудио ---
      const audioBtn = document.createElement("img");
      audioBtn.src = "assets/images/speaker-pink.png";
      audioBtn.className = "button audio-button";
      audioBtn.title = "Пусни аудио файл";
      li.appendChild(audioBtn);

      audioBtn.addEventListener("click", () => {
        document.getElementById("audio-box").style.display = "block";
        document.getElementById("name").textContent = dance.name;

        const container = document.getElementById("audios-to-choose");
        container.innerHTML = ""; // изчистване при нов клик

        const listOfSongs = document.createElement("ol");

        dance.audio_names.forEach((name, index) => {
          const a = document.createElement("a");
          a.textContent = name;
          a.classList = "song-link";
          a.href = "#"; // за да не презарежда

          const li = document.createElement("li");
          li.appendChild(a);
          listOfSongs.appendChild(li);

          a.addEventListener("click", (e) => {
            e.preventDefault();

            // махане на активния клас от всички
            document
              .querySelectorAll(".song-link")
              .forEach((link) => link.classList.remove("active"));

            // добавяне на текущия
            a.classList.add("active");

            // пускане на аудиото
            const file = dance.audio_files[index];
            audio.src = "assets/audio/" + file;
            audio.play();
            audio.volume = 0.2;
          });
        });

        container.appendChild(listOfSongs);
      });

      // --- Бутон за видео ---
      const videoBtn = document.createElement("img");
      videoBtn.src = "assets/images/video-pink.png";
      videoBtn.className = "button";
      videoBtn.title = "Отвори видеото";

      if (dance.video_url && dance.video_url.trim() !== "") {
        videoBtn.onclick = () => {
          window.open(dance.video_url, "_blank");
        };
      } else {
        videoBtn.classList.add("disabled");
      }

      li.appendChild(videoBtn);

      // --- Бутон за описание ---
      const infoBtn = document.createElement("img");
      infoBtn.src = "assets/images/text-file-pink.png";
      infoBtn.className = "button";
      infoBtn.title = "Покажи информация";

      infoBtn.onclick = () => {
        openInfoBox(
          dance.name,
          dance.region,
          dance.measure,
          dance.origin,
          dance.characteristics,
          dance.dancers,
          dance.forms_and_rotation,
          dance.body_orientation_direction_legs_moves,
          dance.hands_position_and_moves,
          dance.shouts,
          dance.sources,
        );
      };

      li.appendChild(infoBtn);

      ol.appendChild(li);
    });

    yearSection.appendChild(ol);

    container.appendChild(yearSection);
  });
}

function openInfoBox(
  name,
  region,
  measure,
  origin,
  characteristics,
  dancers,
  forms_and_rotation,
  body_orientation_direction_legs_moves,
  hands_position_and_moves,
  shouts,
  sources,
) {
  // reset на всички секции
  const sections = [
    "origin",
    "characteristics",
    "dancers",
    "forms-and-rotation",
    "body-orientation-direction-legs-moves",
    "hands-position-and-moves",
    "shouts",
    "sources",
  ];

  sections.forEach((id) => {
    document.getElementById(id).style.display = "none";
  });

  // reset и на текста
  document.getElementById("info-origin").textContent = "";
  document.getElementById("info-characteristics").textContent = "";
  document.getElementById("info-dancers").textContent = "";
  document.getElementById("info-forms-and-rotation").textContent = "";
  document.getElementById(
    "info-body-orientation-direction-legs-moves",
  ).textContent = "";
  document.getElementById("info-hands-position-and-moves").textContent = "";
  document.getElementById("info-shouts").textContent = "";
  document.getElementById("info-sources").textContent = "";

  // основни данни (винаги ги има)
  document.getElementById("info-name").textContent = name;
  document.getElementById("info-region").textContent = region;
  document.getElementById("info-measure").textContent = measure;

  // условни секции
  if (origin && origin.trim() !== "") {
    document.getElementById("origin").style.display = "block";
    document.getElementById("info-origin").textContent = origin;
  }

  if (characteristics && characteristics.trim() !== "") {
    document.getElementById("characteristics").style.display = "block";
    document.getElementById("info-characteristics").textContent =
      characteristics;
  }

  if (dancers && dancers.trim() !== "") {
    document.getElementById("dancers").style.display = "block";
    document.getElementById("info-dancers").textContent = dancers;
  }

  if (forms_and_rotation && forms_and_rotation.trim() !== "") {
    document.getElementById("forms-and-rotation").style.display = "block";
    document.getElementById("info-forms-and-rotation").textContent =
      forms_and_rotation;
  }

  if (body_orientation_direction_legs_moves?.trim()) {
    document.getElementById(
      "body-orientation-direction-legs-moves",
    ).style.display = "block";
    document.getElementById(
      "info-body-orientation-direction-legs-moves",
    ).textContent = body_orientation_direction_legs_moves;
  }

  if (hands_position_and_moves?.trim()) {
    document.getElementById("hands-position-and-moves").style.display = "block";
    document.getElementById("info-hands-position-and-moves").textContent =
      hands_position_and_moves;
  }

  if (shouts?.trim()) {
    document.getElementById("shouts").style.display = "block";
    document.getElementById("info-shouts").textContent = shouts;
  }

  if (sources?.trim()) {
    document.getElementById("sources").style.display = "block";
    document.getElementById("info-sources").textContent = sources;
  }

  document.getElementById("info-box").style.display = "block";
}

if (isIOS) {
  document.getElementById('volume-down-button').style.display = 'none';
  document.getElementById('volume-up-button').style.display = 'none';
}

function closeInfoBox() {
  document.getElementById("info-box").style.display = "none";
}

function closeAudioBox() {
  stopAudio();
  audio = new Audio();
  document.getElementById("audio-box").style.display = "none";
}

function volumeDown() {
  audio.volume -= 0.1;
}

function volumeUp() {
  audio.volume += 0.1;
}

function startAudio(song) {
  audio.play(song);
  audio.volume = 0.2;
}

function pauseAudio() {
  audio.pause();
}

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
}
