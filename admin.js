let editId = null;

const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");
const tableBody = document.getElementById("tableBody");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const statusBox = document.getElementById("status");

function setStatus(message, isError = false) {
    statusBox.textContent = message;
    statusBox.style.color = isError ? "#dc2626" : "#15803d";
}

async function readResponse(response) {
    const text = await response.text();
    let data = text;

    try {
        data = JSON.parse(text);
    } catch (_) {}

    if (!response.ok) {
        const msg = typeof data === "object" && data !== null
            ? (data.message || data.error || JSON.stringify(data))
            : data;
        throw new Error(msg || `HTTP ${response.status}`);
    }

    return data;
}

async function saveData() {
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (!question || !answer) {
        setStatus("Please fill all fields.", true);
        return;
    }

    saveButton.disabled = true;

    try {
        const url = editId === null
            ? "/api/admin/save"
            : `/api/admin/update/${editId}`;

        const method = editId === null ? "POST" : "PUT";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, answer })
        });

        const data = await readResponse(response);

        setStatus(typeof data === "string" ? data : "Saved successfully.");
        clearForm();
        await loadData();
    } catch (error) {
        console.error("SAVE ERROR:", error);
        setStatus("Save failed: " + error.message, true);
    } finally {
        saveButton.disabled = false;
    }
}

async function loadData() {
    try {
        setStatus("Loading questions...");

        const response = await fetch("/api/admin/all", {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        const data = await readResponse(response);

        if (!Array.isArray(data)) {
            throw new Error("Server did not return a question list.");
        }

        tableBody.replaceChildren();

        if (data.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 4;
            cell.textContent = "No questions found.";
            row.appendChild(cell);
            tableBody.appendChild(row);
        } else {
            data.forEach(item => {
                const row = document.createElement("tr");

                const idCell = document.createElement("td");
                idCell.textContent = item.id ?? "";

                const questionCell = document.createElement("td");
                questionCell.textContent = item.question ?? "";

                const answerCell = document.createElement("td");
                answerCell.textContent = item.answer ?? "";

                const actionCell = document.createElement("td");

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.className = "edit";
                editButton.type = "button";
                editButton.onclick = () =>
                    editData(item.id, item.question, item.answer);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "delete";
                deleteButton.type = "button";
                deleteButton.onclick = () => deleteData(item.id);

                actionCell.append(editButton, deleteButton);
                row.append(idCell, questionCell, answerCell, actionCell);
                tableBody.appendChild(row);
            });
        }

        setStatus(`${data.length} question(s) loaded.`);
    } catch (error) {
        console.error("LOAD ERROR:", error);
        tableBody.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 4;
        cell.textContent = "Unable to load data: " + error.message;
        row.appendChild(cell);
        tableBody.appendChild(row);

        setStatus("Could not load questions.", true);
    }
}

async function deleteData(id) {
    if (!confirm("Delete this record?")) return;

    try {
        const response = await fetch(`/api/admin/delete/${id}`, {
            method: "DELETE"
        });

        const data = await readResponse(response);
        setStatus(typeof data === "string" ? data : "Deleted successfully.");

        if (editId === id) clearForm();
        await loadData();
    } catch (error) {
        console.error("DELETE ERROR:", error);
        setStatus("Delete failed: " + error.message, true);
    }
}

function editData(id, question, answer) {
    editId = id;
    questionInput.value = question ?? "";
    answerInput.value = answer ?? "";
    saveButton.textContent = "Update";
    cancelButton.style.display = "inline-block";
    questionInput.focus();
    setStatus(`Editing question ID ${id}.`);
}

function clearForm() {
    editId = null;
    questionInput.value = "";
    answerInput.value = "";
    saveButton.textContent = "Save";
    cancelButton.style.display = "none";
}

cancelButton.addEventListener("click", clearForm);
saveButton.addEventListener("click", saveData);

window.addEventListener("DOMContentLoaded", loadData);
