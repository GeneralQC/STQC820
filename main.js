 // โหลดชื่อและสาขาจาก localStorage แล้วโชว์
        document.addEventListener("DOMContentLoaded", function () {
            const username = localStorage.getItem("username") || "-";
            const branch = localStorage.getItem("branch") || "-";
            const permission = localStorage.getItem("permission") || "-";
            document.getElementById("currentUser").innerText = username;
            document.getElementById("currentBranch").innerText = branch;
            document.getElementById("currentpermission").innerText = permission;
        });

        function logout() {
            localStorage.clear();
            window.location.href = "Login.html";
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

            const target = document.getElementById('form-' + type);
            if (target) {
                target.style.display = 'block';

                if (type === "cricket" || type === "approve") {
                    loadAllData(type);  // ส่ง type ไปให้แยก render
                }

                // ✅ เฉพาะแบบฟอร์มที่มี multi-select ค่อย apply select2
                $(target).find('.multi-select').select2({
                    placeholder: "เลือกรหัสรายการ",
                    allowClear: true
                });
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


                    fetch("https://script.google.com/macros/s/AKfycbxN0bT5jP0AS-4SYQNVw69f-enB2cYEJ7A8N4cutH6kCagxoiv0-xaFzPYSu6T3nR7b/exec", {
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
            fetch("https://script.google.com/macros/s/AKfycbxN0bT5jP0AS-4SYQNVw69f-enB2cYEJ7A8N4cutH6kCagxoiv0-xaFzPYSu6T3nR7b/exec", {
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

