// โหลดชื่อและสาขาจาก localStorage แล้วโชว์
document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username") || "-";
    const branch = localStorage.getItem("branch") || "-";
    const permission = localStorage.getItem("permission") || "-";
    document.getElementById("currentUser").innerText = username;
    document.getElementById("currentBranch").innerText = branch;
    document.getElementById("currentpermission").innerText = permission;

    // ✅ เพิ่มตรงนี้เพื่อส่ง permission ไป iframe calendar
    const iframe = document.getElementById("form-calendar");
    if (iframe && iframe.src && !iframe.src.includes("permission=")) {
        iframe.src += (iframe.src.includes("?") ? "&" : "?") + "permission=" + encodeURIComponent(permission);
    }


});

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function getCurrentFormType() {
    const visibleForm = document.querySelector('.form-container:not([style*="display: none"])');
    if (visibleForm) {
        return visibleForm.id.replace('form-', '');
    }
    return null;
}

function loadIndexAuto() {

    const currentType = getCurrentFormType();
    if (!currentType) return;

    // โหลด index คำนวณ
    fetch(`https://script.google.com/macros/s/AKfycbxwYWYnIbKzyWnhJsUpOC2ItceDaHyGV3QVyJnrpWvxDZpFRhPYDfqnAwWKdpf8nJOD/exec?type=${currentType}`)
        .then(res => res.text())
        .then(index => {
            document.querySelector(`#form-${currentType} input[name="index"]`).value = index;
        })
        .catch(err => {
            console.error("โหลด index ไม่สำเร็จ:", err);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    showForm("chicken");
    loadIndexAuto(); // โหลด index ครั้งแรก

    document.querySelectorAll(".submenu li").forEach(item => {
        item.addEventListener("click", () => {
            setTimeout(loadIndexAuto, 100); // รอให้ showForm ทำงานก่อน
        });
    });
});


function showForm(type) {
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(f => f.style.display = 'none');

    if (type === 'calendar') {
        document.getElementById('form-calendar-container').style.display = 'block';
    } else {
        const target = document.getElementById('form-' + type);
        if (target) {
            target.style.display = 'block';

            if (type === "cricket" || type === "approve") {
                loadAllData(type);
            }

            // ✅ เรียกฟังก์ชันสร้างตารางแบบไดนามิก
            if (type.endsWith("plan")) {
                createDynamicTableUI(type, `dynamicTable-${type}`);
            }

            $(target).find('.multi-select').select2({
                placeholder: "เลือกรหัสรายการ",
                allowClear: true
            });
        }
    }




}

document.addEventListener("DOMContentLoaded", function () {
    const toggles = document.querySelectorAll(".has-submenu");

    toggles.forEach(item => {
        item.addEventListener("click", function () {
            this.classList.toggle("open");
        });
    });
});

// ✅ ตรวจจับ form ที่กำลังแสดงอยู่เพื่อหา currentType
function getCurrentFormType() {
    const visibleForm = document.querySelector('.form-container:not([style*="display: none"])');
    if (!visibleForm || !visibleForm.id.startsWith("form-")) return "";
    return visibleForm.id.replace("form-", "");
}
let currentType = "";




document.addEventListener("DOMContentLoaded", function () {
    // ✅ set default: แสดง 'chicken'
    showForm("chicken");

    // ✅ toggle submenu
    document.querySelectorAll(".has-submenu").forEach(item => {
        item.addEventListener("click", function () {
            this.classList.toggle("open");
        });
    });

    // ✅ บันทึกข้อมูล
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const type = getCurrentFormType(); // ✅ ตรวจจากฟอร์มที่แสดง

            if (!type) {
                alert("ไม่สามารถระบุประเภทฟอร์มได้");
                return;
            }

            const formData = new FormData(this);
            formData.append("type", type); // ส่งค่า type ไปให้ .gs ใช้

            const username = document.getElementById("currentUser").innerText.trim();
            formData.append("username", username);


            fetch("https://script.google.com/macros/s/AKfycbzs6KoJyWaRc8NrikwRUwYOHx4yTpEbXSiinLVYsF6zAPYuPMd__bA8Yr-KtHDX2kde/exec", {
                method: "POST",
                body: formData
            })
                .then(res => res.text())
                .then(result => {
                    if (result === "duplicate") {
                        alert("ข้อมูลซ้ำ ไม่สามารถบันทึกได้");
                    } else if (result === "success") {
                        alert("บันทึกสำเร็จ");
                        // ✅ วิธี 1: รีเฟรชทั้งหน้า
                        location.reload();

                        // ✅ วิธี 2: รีเซ็ตฟอร์มเฉย ๆ (ไม่โหลดใหม่)
                        // this.reset();
                    } else {
                        alert("เกิดข้อผิดพลาด: " + result);
                    }
                });
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".has-submenu").forEach(item => {
        item.addEventListener("click", function () {
            this.classList.toggle("open");
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const permission = localStorage.getItem("permission") || "";

    // ซ่อนเมนู Approve ถ้าไม่ใช่ Admin หรือ AV/AVP
    if (permission !== "Admin" && permission !== "AV/AVP") {
        const approveMenu = document.getElementById("approveMenu");
        if (approveMenu) {
            approveMenu.style.display = "none";
        }


        // ✅ ซ่อนเมนูปฏิทิน ถ้าไม่ใช่ Admin หรือ AV/AVP
        //const calendarMenu = document.getElementById("calendarMenu");
        //if (calendarMenu) {
        // calendarMenu.style.display = "none";
        //}
    }












});

// โหลด ตารางโชว์ข้อมูล
let allDataRows = []; // เก็บข้อมูลทั้งหมด

function loadAllData(viewType) {
    fetch("https://script.google.com/macros/s/AKfycbxwYWYnIbKzyWnhJsUpOC2ItceDaHyGV3QVyJnrpWvxDZpFRhPYDfqnAwWKdpf8nJOD/exec?mode=loadAll")
        .then(res => res.json())
        .then(data => {
            allDataRows = data.reverse(); // เก็บไว้ทั้งหมด
            if (viewType === "cricket") {
                renderTable(data);  // แสดงเฉพาะตารางตรวจสอบ
            } else if (viewType === "approve") {
                renderApproveTable(data);  // แสดงเฉพาะตาราง Approve
            }
        });
}

function renderTable(data) {


    const header = document.getElementById("cricketHeader");
    const body = document.getElementById("cricketTableBody");

    header.innerHTML = "";
    body.innerHTML = "";

    const thRow = ["ประเภท", "ลำดับ", "กลุ่มอาหาร", "รหัสอาหาร", "M", "CP", "FAT", "FIB", "MINERAL", "HEAVY METAL", "MYCO-T", "As", "Hg(S)", "GMO", "COC", "A-biotic", "PEST", "PEST Comment", "Campylobacter", "Campylobacter Comment", "LAB", "LAB comment", "Sal", "Sal comment", "รายละเอียด", "สถานะงาน", "ผู้บันทึก", "เอกสารแนบ"];
    thRow.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        header.appendChild(th);
    });

    const sortedData = data.slice().sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
    sortedData.forEach((row, rowIndex) => {

        const tr = document.createElement("tr");
        const ATTACH_COL_INDEX = 27;
        row.forEach((cell, i) => {
            const td = document.createElement("td");
            if (i === ATTACH_COL_INDEX) {
                if (cell && typeof cell === "string" && cell.startsWith("http")) {
                    td.innerHTML = `<a href="${cell}" target="_blank">📎</a>`;
                } else {
                    td.textContent = "-";
                }
            } else {
                td.textContent = cell; // ✅ ต้องปิดด้วย ;
            }

            // ✅ ใส่สีพื้นหลังตามสถานะที่ column index 25
            if (i === 25) {
                if (cell.toLowerCase() === "completed") {
                    td.style.backgroundColor = "#d4edda";  // เขียวอ่อน
                    td.style.color = "#155724";
                } else if (cell.toLowerCase() === "in process") {
                    td.style.backgroundColor = "#fff3cd";  // เหลืองอ่อน
                    td.style.color = "#856404";
                }
            }

            tr.appendChild(td);
        });

        body.appendChild(tr);
    });
}



// ✅ เรียกใช้เมื่อคลิกเมนูตรวจสอบสถานะแผน
//function showForm(type) {
//document.querySelectorAll('.form-container').forEach(f => f.style.display = 'none');
//const form = document.getElementById('form-' + type);
// if (form) {
//  form.style.display = 'block';
//  $(form).find('.multi-select').select2({
//     placeholder: "เลือกรหัสรายการ",
//   allowClear: true
//  });
//  if (type === "cricket") loadAllData();
//}
//}

function applyFilters() {
    const usernameFilter = document.getElementById("filterUsername").value.toLowerCase();
    const typeFilter = document.getElementById("filterType").value.toUpperCase();

    const filtered = allDataRows.filter(row => {
        const typeMatch = typeFilter === "" || row[0].toUpperCase() === typeFilter;
        const userMatch = usernameFilter === "" || (row[row.length - 1] + "").toLowerCase().includes(usernameFilter);
        return typeMatch && userMatch;
    });

    renderTable(filtered);
}

function renderApproveTable(data) {
    const header = document.getElementById("approveHeader");
    const body = document.getElementById("approveTableBody");
    header.innerHTML = "";
    body.innerHTML = "";

    const thRow = ["ประเภท", "ลำดับ", "กลุ่มอาหาร", "รหัสอาหาร", "M", "CP", "FAT", "FIB", "MINERAL", "HEAVY METAL", "MYCO-T", "As", "Hg(S)", "GMO", "COC", "A-biotic", "PEST", "PEST Comment", "Campylobacter", "Campylobacter Comment", "LAB", "LAB comment", "Sal", "Sal comment", "รายละเอียด", "สถานะงาน", "ผู้บันทึก", "เอกสารแนบ", "Action"];
    thRow.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        header.appendChild(th);
    });

    const sortedData = data.slice().sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
    sortedData.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        const ATTACH_COL_INDEX = 27;
        row.forEach((cell, i) => {
            const td = document.createElement("td");
            if (i === ATTACH_COL_INDEX) {
                if (cell && typeof cell === "string" && cell.startsWith("http")) {
                    td.innerHTML = `<a href="${cell}" target="_blank">📎</a>`;
                } else {
                    td.textContent = "-";
                }
            } else {
                td.textContent = cell; // ✅ ต้องปิดด้วย ;
            }
            if (i === 25) {
                const status = cell.toLowerCase();
                if (status === "completed") {
                    td.style.backgroundColor = "#d4edda";  // เขียวอ่อน
                    td.style.color = "#155724";
                    td.style.fontWeight = "bold";
                } else if (status === "in process") {
                    td.style.backgroundColor = "#fff3cd";  // เหลืองอ่อน
                    td.style.color = "#856404";
                    td.style.fontWeight = "bold";
                }
            }

            tr.appendChild(td);
        });

        // ✅ เพิ่มปุ่มอัปเดตสถานะ
        // 🟡 แก้จุดนี้ให้ส่ง type ที่อยู่ใน column index 0 (ประเภท: CHICKEN, PIG)
        const type = row[0].toLowerCase();

        const actionTd = document.createElement("td");
        actionTd.innerHTML = `
            <button onclick="updateStatus(${rowIndex}, 'Completed', '${type}')">✅</button>
            <button onclick="updateStatus(${rowIndex}, 'Reject', '${type}')">❌</button>
        `;
        tr.appendChild(actionTd);
        body.appendChild(tr);
    });
}

function updateStatus(rowIndex, newStatus, type) {
    fetch("https://script.google.com/macros/s/AKfycbzs6KoJyWaRc8NrikwRUwYOHx4yTpEbXSiinLVYsF6zAPYuPMd__bA8Yr-KtHDX2kde/exec", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `mode=update&type=${type}&rowIndex=${rowIndex + 2}&status=${encodeURIComponent(newStatus)}`
    })
        .then(res => res.text())
        .then(response => {
            if (response === "Updated") {
                alert("อัปเดตสถานะเรียบร้อยแล้ว");
                loadAllData("approve");
            } else {
                alert("เกิดข้อผิดพลาด: " + response);
            }
        })
        .catch(err => {
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อ: " + err);
        });
}


function updateCell(cell, row, col) {
    const newValue = cell.innerText.trim();
    cell.style.backgroundColor = "#fff3cd"; // สีเหลืองอ่อนระหว่างกำลังบันทึก

    google.script.run
        .withSuccessHandler(function () {
            cell.style.backgroundColor = "#d4edda"; // สีเขียวหลังบันทึกสำเร็จ
            console.log("✔️ Cell saved:", row, col);
            setTimeout(() => cell.style.backgroundColor = "", 1500); // ล้างสี
        })
        .withFailureHandler(function (err) {
            cell.style.backgroundColor = "#f8d7da"; // สีแดงถ้าล้มเหลว
            console.error("❌ Error saving cell:", err);
        })
        .updateSheetCell(newValue, row, col);
}



function createDynamicTableUI(formId, tableId) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error("❌ ไม่พบ table ID:", tableId);
        return;
    }

    table.innerHTML = ''; // ล้างตารางก่อนเริ่มใหม่
    let selectedCells = [];

    function toggleCellSelection(event, cell) {
        if (event.ctrlKey || event.metaKey) {
            // กด Ctrl = เพิ่มหรือเอาออกจากการเลือก
            if (cell.classList.contains("selected")) {
                cell.classList.remove("selected");
                selectedCells = selectedCells.filter(c => c !== cell);
            } else {
                cell.classList.add("selected");
                selectedCells.push(cell);
            }
        } else {
            // ไม่กด Ctrl = ล้าง selection เดิมแล้วเลือกใหม่
            clearSelection();
            cell.classList.add("selected");
            selectedCells.push(cell);
        }
    }

    function createInitialTable(rows = 5, cols = 5) {
        // 🔵 สร้าง thead
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        for (let i = 0; i < cols; i++) {
            const th = document.createElement("th");
            th.textContent = `Header ${i + 1}`;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // 🔵 สร้าง tbody
        const tbody = document.createElement("tbody");
        for (let r = 0; r < rows; r++) {
            const row = document.createElement("tr");
            for (let c = 0; c < cols; c++) {
                const td = document.createElement("td");
                td.contentEditable = true;
                td.innerText = `R${r + 1}C${c + 1}`;
                td.addEventListener('click', (event) => toggleCellSelection(event, td));
                row.appendChild(td);
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
    }

    function addRow() {
        const tbody = table.querySelector("tbody");
        const row = document.createElement("tr");
        const cols = table.rows[0]?.cells.length || 1;
        const rowIndex = tbody.rows.length;
        for (let i = 0; i < cols; i++) {
            const cell = document.createElement("td");
            cell.contentEditable = true;
            cell.innerText = `New R${rowIndex + 1}C${i + 1}`;
            cell.addEventListener('click', (event) => toggleCellSelection(event, cell)); 
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }

    function addColumn() {
        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");

        // เพิ่มใน thead
        const headerRow = thead.rows[0];
        const newTh = document.createElement("th");
        newTh.textContent = `Header ${headerRow.cells.length + 1}`;
        headerRow.appendChild(newTh);

        // เพิ่มใน tbody
        for (let r = 0; r < tbody.rows.length; r++) {
            const cell = document.createElement("td");
            cell.contentEditable = true;
            cell.innerText = `New R${r + 1}C${headerRow.cells.length}`;
            cell.addEventListener('click', (event) => toggleCellSelection(event, cell)); 
            tbody.rows[r].appendChild(cell);
        }
    }

    function deleteRow() {
        const tbody = table.querySelector("tbody");
        if (tbody.rows.length > 0) {
            tbody.deleteRow(-1);
        }
    }

    function deleteColumn() {
        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");

        // ลบหัวตาราง
        const headerRow = thead.rows[0];
        if (headerRow.cells.length > 0) {
            headerRow.deleteCell(-1);
        }

        // ลบคอลัมน์ใน tbody
        for (let row of tbody.rows) {
            if (row.cells.length > 0) {
                row.deleteCell(-1);
            }
        }
    }

    function mergeCells() {
        if (selectedCells.length < 2) return alert("เลือกอย่างน้อย 2 เซลล์เพื่อรวม");

        // แยกแถวและคอลัมน์ของแต่ละเซลล์
        const cellPositions = selectedCells.map(cell => {
            const row = cell.parentElement;
            const rowIndex = Array.from(table.rows).indexOf(row);
            const colIndex = Array.from(row.cells).indexOf(cell);
            return { cell, rowIndex, colIndex };
        });

        // 🔍 ตรวจสอบว่าอยู่ในแถวเดียวกัน (แนวนอน)
        const sameRow = cellPositions.every(p => p.rowIndex === cellPositions[0].rowIndex);
        const sameCol = cellPositions.every(p => p.colIndex === cellPositions[0].colIndex);

        if (sameRow) {
            // ✅ แนวนอน → colSpan
            const first = cellPositions[0].cell;
            first.colSpan = selectedCells.length;
            first.innerText = selectedCells.map(c => c.innerText).join(" ");
            for (let i = 1; i < selectedCells.length; i++) {
                selectedCells[i].remove();
            }
        } else if (sameCol) {
            // ✅ แนวตั้ง → rowSpan
            const base = cellPositions.sort((a, b) => a.rowIndex - b.rowIndex)[0];
            base.cell.rowSpan = selectedCells.length;
            base.cell.innerText = selectedCells.map(c => c.innerText).join(" ");
            for (let i = 1; i < cellPositions.length; i++) {
                const targetRow = table.rows[cellPositions[i].rowIndex];
                targetRow.deleteCell(cellPositions[i].colIndex);
            }
        } else {
            alert("กรุณาเลือกเซลล์ที่อยู่ในแถวเดียวกันหรือคอลัมน์เดียวกันเท่านั้น");
        }

        clearSelection();
    }

    function unmergeCells() {
        const cell = selectedCells[0];
        if (cell && cell.colSpan > 1) {
            const row = cell.parentElement;
            const index = Array.from(row.cells).indexOf(cell);
            const span = cell.colSpan;
            const text = cell.innerText.split(" ");
            cell.colSpan = 1;
            for (let i = 1; i < span; i++) {
                const newCell = row.insertCell(index + i);
                newCell.contentEditable = true;
                newCell.innerText = text[i] || "";
                newCell.onclick = () => toggleCellSelection(newCell);
            }
        }
        clearSelection();
    }

    function clearSelection() {
        selectedCells.forEach(cell => cell.classList.remove("selected"));
        selectedCells = [];
    }

    // เชื่อมปุ่มกับ formId
    document.getElementById(`addRowBtn-${formId}`)?.addEventListener('click', addRow);
    document.getElementById(`addColumnBtn-${formId}`)?.addEventListener('click', addColumn);
    document.getElementById(`deleteRowButton-${formId}`)?.addEventListener('click', deleteRow);
    document.getElementById(`deleteColumnButton-${formId}`)?.addEventListener('click', deleteColumn);
    document.getElementById(`mergeButton-${formId}`)?.addEventListener('click', mergeCells);
    document.getElementById(`unmergeButton-${formId}`)?.addEventListener('click', unmergeCells);

    document.getElementById("saveTableBtn-chickenplan").addEventListener("click", () => {
        saveTableToGoogleSheet("chickenplan", "dynamicTable-chickenplan");
    });

    document.getElementById("saveTableBtn-pigplan").addEventListener("click", () => {
        saveTableToGoogleSheet("pigplan", "dynamicTable-pigplan");
    });

    document.getElementById("saveTableBtn-duckplan").addEventListener("click", () => {
        saveTableToGoogleSheet("duckplan", "dynamicTable-duckplan");
    });

    // เริ่มต้นสร้างตาราง
    createInitialTable();
}

// Save ตาราง แผนไป google sheet
function saveTableToGoogleSheet(formId, tableId) {
  const table = document.getElementById(tableId);
  const rows = table.querySelectorAll("tr");
  const tableData = [];

  rows.forEach(row => {
    const rowData = [];
    const cells = row.querySelectorAll("th, td");
    cells.forEach(cell => {
      rowData.push(cell.innerText.trim());
    });
    tableData.push(rowData);
  });

  const formData = new URLSearchParams();
  formData.append("formId", formId);
  formData.append("tableData", JSON.stringify(tableData));

  fetch("https://script.google.com/macros/s/AKfycbwnArBnJIEKXt7c9zzKrpIwOIPK3bIEeko2ky4T7dIY-4TneaAazdZqVlPt17_NOUg8/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  })
  .then(res => res.text())
  .then(result => alert("📤 " + result))
  .catch(err => alert("❌ ส่งข้อมูลล้มเหลว: " + err));
}
