const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const paletteDiv = document.getElementById('palette');
const dashboard = document.getElementById('dashboard');
const historyList = document.getElementById('historyList');
let currentPalette = [];
let currentImage = null;
function triggerUpload() {
  upload.click();
}
upload.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  currentImage = url;
  preview.src = url;
  dashboard.style.display = 'flex';
  generatePalette(url);
});
function generatePalette(imageUrl) {
  const img = new Image();
  img.src = imageUrl;
  img.onload = function () {
    const colorThief = new ColorThief();
    let palette = colorThief.getPalette(img, 10);
    palette = palette.sort(() => 0.5 - Math.random()).slice(0, 5);
    currentPalette = palette.map(c => rgbToHex(c[0], c[1], c[2]));
    renderPalette();
  };
}
function renderPalette() {
  paletteDiv.innerHTML = '';
  currentPalette.forEach(hex => {
    const div = document.createElement('div');
    div.className = 'color-box';
    div.style.background = hex;
    paletteDiv.appendChild(div);
  });
}
function regeneratePalette() {
  if (!currentImage) return alert("Upload image first");
  generatePalette(currentImage);
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}
// 🔥 DOWNLOAD WITH NAME
function downloadPalette() {
  if (currentPalette.length === 0) return alert("Generate palette first");
  let nameInput = document.getElementById("saveName").value.trim();
  let fileName = nameInput ? nameInput.replace(/\s+/g, "_") : "palette";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = currentPalette.length * 100;
  canvas.height = 100;
  currentPalette.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i * 100, 0, 100, 100);
  });
  const link = document.createElement("a");
  link.download = fileName + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
// SAVE
function saveNamedPalette() {
  const name = document.getElementById("saveName").value.trim();
  if (!name) return alert("Enter a name");
  if (currentPalette.length === 0) return alert("Generate palette first");
  let history = JSON.parse(localStorage.getItem("palettes")) || [];
  history.push({ name, colors: currentPalette });
  localStorage.setItem("palettes", JSON.stringify(history));
  document.getElementById("saveName").value = "";
  renderHistory();
}
// DELETE
function deletePalette(index) {
  let history = JSON.parse(localStorage.getItem("palettes")) || [];
  history.splice(index, 1);
  localStorage.setItem("palettes", JSON.stringify(history));
  renderHistory();
}
// EDIT
function editPalette(index) {
  let history = JSON.parse(localStorage.getItem("palettes")) || [];
  const newName = prompt("Enter new name:", history[index].name);
  if (newName) {
    history[index].name = newName;
    localStorage.setItem("palettes", JSON.stringify(history));
    renderHistory();
  }
}
// RENDER
function renderHistory() {
  let history = JSON.parse(localStorage.getItem("palettes")) || [];
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.innerHTML = "<p>No saved templates yet</p>";
    return;
  }
  history.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "history-item";
    const title = document.createElement("p");
    title.innerText = item.name;
    div.appendChild(title);
    item.colors.forEach(color => {
      const box = document.createElement("span");
      box.style.background = color;
      box.style.display = "inline-block";
      box.style.width = "25px";
      box.style.height = "25px";
      box.style.marginRight = "5px";
      box.style.borderRadius = "5px";
      div.appendChild(box);
    });
    const actions = document.createElement("div");
    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.onclick = () => deletePalette(index);
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.onclick = () => editPalette(index);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    div.appendChild(actions);
    historyList.appendChild(div);
  });
}
window.onload = renderHistory;




// // const upload = document.getElementById('upload');
// // const preview = document.getElementById('preview');
// // const paletteDiv = document.getElementById('palette');
// // const dashboard = document.getElementById('dashboard');
// // const historyList = document.getElementById('historyList');
// // let currentPalette = [];
// // let currentImage = null;
// // function triggerUpload() {
// //   upload.click();
// // }
// // upload.addEventListener('change', function () {
// //   const file = this.files[0];
// //   if (!file) return;
// //   const url = URL.createObjectURL(file);
// //   currentImage = url;
// //   preview.src = url;
// //   dashboard.style.display = 'flex';
// //   generatePalette(url);
// // });
// // //////////////////////////////////////////////////
// // // 🔥 GENERATE PALETTE (WITH VARIATION)
// // //////////////////////////////////////////////////
// // function generatePalette(imageUrl) {
// //   const img = new Image();
// //   img.crossOrigin = "anonymous";
// //   img.src = imageUrl;
// //   img.onload = function () {
// //     const colorThief = new ColorThief();
// //     // 🔥 get more colors and randomize
// //     let palette = colorThief.getPalette(img, 10);
// //     // shuffle colors for variation
// //     palette = palette.sort(() => 0.5 - Math.random()).slice(0, 5);
// //     currentPalette = palette.map(c => rgbToHex(c[0], c[1], c[2]));
// //     renderPalette();
// //   };
// // }
// // //////////////////////////////////////////////////
// // // 🎨 DISPLAY PALETTE
// // //////////////////////////////////////////////////
// // function renderPalette() {
// //   paletteDiv.innerHTML = '';
// //   currentPalette.forEach(hex => {
// //     const div = document.createElement('div');
// //     div.className = 'color-box';
// //     div.style.background = hex;
// //     div.innerHTML = `<small>${hex}</small>`;
// //     paletteDiv.appendChild(div);
// //   });
// // }
// // //////////////////////////////////////////////////
// // // 🔁 REFRESH (NOW ACTUALLY CHANGES COLORS)
// // //////////////////////////////////////////////////
// // function regeneratePalette() {
// //   if (!currentImage) {
// //     alert("Upload an image first");
// //     return;
// //   }
// //   generatePalette(currentImage);
// // }
// // //////////////////////////////////////////////////
// // // 🎨 RGB → HEX
// // //////////////////////////////////////////////////
// // function rgbToHex(r, g, b) {
// //   return "#" + [r, g, b]
// //     .map(x => x.toString(16).padStart(2, "0"))
// //     .join("");
// // }
// // //////////////////////////////////////////////////
// // // ⬇ DOWNLOAD
// // //////////////////////////////////////////////////
// // function downloadPalette() {
// //   if (currentPalette.length === 0) {
// //     alert("Generate palette first");
// //     return;
// //   }
// //   const canvas = document.createElement("canvas");
// //   const ctx = canvas.getContext("2d");
// //   const size = 100;
// //   canvas.width = currentPalette.length * size;
// //   canvas.height = size;
// //   currentPalette.forEach((color, i) => {
// //     ctx.fillStyle = color;
// //     ctx.fillRect(i * size, 0, size, size);
// //   });
// //   const link = document.createElement("a");
// //   link.download = "palette.png";
// //   link.href = canvas.toDataURL("image/png");
// //   link.click();
// // }
// // //////////////////////////////////////////////////
// // // 💾 SAVE TEMPLATE (FIXED)
// // //////////////////////////////////////////////////
// // function saveNamedPalette() {
// //   const nameInput = document.getElementById("saveName");
// //   const name = nameInput.value.trim();
// //   if (currentPalette.length === 0) {
// //     alert("Generate a palette first!");
// //     return;
// //   }
// //   if (!name) {
// //     alert("Enter a name");
// //     return;
// //   }
// //   let history = JSON.parse(localStorage.getItem("palettes")) || [];
// //   history.push({
// //     name: name,
// //     colors: currentPalette
// //   });
// //   localStorage.setItem("palettes", JSON.stringify(history));
// //   nameInput.value = "";
// //   renderHistory();
// //   alert("Saved successfully ✅");
// // }
// // //////////////////////////////////////////////////
// // // 📂 RENDER SAVED TEMPLATES (FIXED)
// // //////////////////////////////////////////////////
// // function renderHistory() {
// //   let history = JSON.parse(localStorage.getItem("palettes")) || [];
// //   historyList.innerHTML = '';
// //   if (history.length === 0) {
// //     historyList.innerHTML = "<p>No saved templates yet</p>";
// //     return;
// //   }
// //   history.forEach(item => {
// //     const div = document.createElement("div");
// //     div.className = "history-item";
// //     const title = document.createElement("p");
// //     title.innerText = item.name;
// //     div.appendChild(title);
// //     const row = document.createElement("div");
// //     item.colors.forEach(color => {
// //       const box = document.createElement("span");
// //       box.style.background = color;
// //       box.style.display = "inline-block";
// //       box.style.width = "25px";
// //       box.style.height = "25px";
// //       box.style.marginRight = "5px";
// //       box.style.borderRadius = "5px";
// //       row.appendChild(box);
// //     });
// //     div.appendChild(row);
// //     historyList.appendChild(div);
// //   });
// // }
// // //////////////////////////////////////////////////
// // // 🚀 LOAD ON START
// // //////////////////////////////////////////////////
// // window.onload = function () {
// //   renderHistory();
// // };


// const upload = document.getElementById('upload'); const preview = document.getElementById('preview'); const paletteDiv = document.getElementById('palette'); const dashboard = document.getElementById('dashboard'); const historyList = document.getElementById('historyList');
// let currentPalette = []; let currentImage = null;
// function triggerUpload() { upload.click(); }
// upload.addEventListener('change', function () { const file = this.files[0]; if (!file) return;
// const url = URL.createObjectURL(file); currentImage = url;
// preview.src = url; dashboard.style.display = 'flex';
// generatePalette(url); });
// function generatePalette(imageUrl) { const img = new Image(); img.crossOrigin = "anonymous"; img.src = imageUrl;
// img.onload = function () { const colorThief = new ColorThief(); let palette = colorThief.getPalette(img, 10);
// palette = palette.sort(() => 0.5 - Math.random()).slice(0, 5);
// currentPalette = palette.map(c => rgbToHex(c[0], c[1], c[2]));
// renderPalette();
// }; }
// function renderPalette() { paletteDiv.innerHTML = '';
// currentPalette.forEach(hex => { const div = document.createElement('div'); div.className = 'color-box'; div.style.background = hex; div.innerHTML = <small>${hex}</small>; paletteDiv.appendChild(div); }); }
// function regeneratePalette() { if (!currentImage) return alert("Upload image first"); generatePalette(currentImage); }
// function rgbToHex(r, g, b) { return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join(""); }
// function downloadPalette() { if (currentPalette.length === 0) return alert("Generate palette first");
// const canvas = document.createElement("canvas"); const ctx = canvas.getContext("2d");
// canvas.width = currentPalette.length * 100; canvas.height = 100;
// currentPalette.forEach((color, i) => { ctx.fillStyle = color; ctx.fillRect(i * 100, 0, 100, 100); });
// const link = document.createElement("a"); link.download = "palette.png"; link.href = canvas.toDataURL(); link.click(); }
// // SAVE function saveNamedPalette() { const name = document.getElementById("saveName").value.trim();
// if (!name) return alert("Enter a name"); if (currentPalette.length === 0) return alert("Generate palette first");
// let history = JSON.parse(localStorage.getItem("palettes")) || [];
// history.push({ name, colors: currentPalette });
// localStorage.setItem("palettes", JSON.stringify(history));
// document.getElementById("saveName").value = "";
// renderHistory();
// // DELETE function deletePalette(index) { let history = JSON.parse(localStorage.getItem("palettes")) || [];
// history.splice(index, 1);
// localStorage.setItem("palettes", JSON.stringify(history));
// renderHistory();
// // EDIT function editPalette(index) { let history = JSON.parse(localStorage.getItem("palettes")) || [];
// const newName = prompt("Enter new name:", history[index].name);
// if (newName) { history[index].name = newName; localStorage.setItem("palettes", JSON.stringify(history)); renderHistory(); }
// // RENDER function renderHistory() { let history = JSON.parse(localStorage.getItem("palettes")) || [];
// historyList.innerHTML = '';
// if (history.length === 0) { historyList.innerHTML = "<p>No saved templates yet</p>"; return; }
// history.forEach((item, index) => { const div = document.createElement("div"); div.className = "history-item";
// const title = document.createElement("p");
// title.innerText = item.name;
// div.appendChild(title);
// item.colors.forEach(color => {
//   const box = document.createElement("span");
//   box.style.background = color;
//   box.style.display = "inline-block";
//   box.style.width = "25px";
//   box.style.height = "25px";
//   box.style.marginRight = "5px";
//   box.style.borderRadius = "5px";
//   div.appendChild(box);
// });
// const actions = document.createElement("div");
// actions.className = "history-actions";
// const delBtn = document.createElement("button");
// delBtn.innerText = "Delete";
// delBtn.onclick = () => deletePalette(index);
// const editBtn = document.createElement("button");
// editBtn.innerText = "Edit";
// editBtn.onclick = () => editPalette(index);
// actions.appendChild(editBtn);
// actions.appendChild(delBtn);
// div.appendChild(actions);
// historyList.appendChild(div);
// });
// window.onload = renderHistory;