let editId = null;

const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");
const tableBody = document.getElementById("tableBody");

const BACKEND_URL = "https://chatbot-g2ay.onrender.com";

async function saveData() {

    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (!question || !answer) {
        alert("Please fill all fields");
        return;
    }

    const url = editId === null
        ? `${BACKEND_URL}/api/admin/save`
        : `${BACKEND_URL}/api/admin/update/${editId}`;

    const method = editId === null ? "POST" : "PUT";

    try {

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question,
                answer: answer
            })
        });

        const message = await response.text();

        if (!response.ok) {
            throw new Error(message || `HTTP ${response.status}`);
        }

        alert(message);

        clearForm();

        await loadData();

    } catch (error) {

        console.error("SAVE ERROR:", error);

        alert("Error: " + error.message);
    }
}


async function loadData() {

    try {

        const response = await fetch(
            `${BACKEND_URL}/api/admin/all`
        );

        console.log("Admin status:", response.status);

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        console.log("Questions:", data);

        tableBody.replaceChildren();

        data.forEach(item => {

            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = item.id;

            const questionCell = document.createElement("td");
            questionCell.textContent = item.question;

            const answerCell = document.createElement("td");
            answerCell.textContent = item.answer;

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit";

            editButton.onclick = function () {
                editData(
                    item.id,
                    item.question,
                    item.answer
                );
            };


            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete";

            deleteButton.onclick = function () {
                deleteData(item.id);
            };


            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(idCell);
            row.appendChild(questionCell);
            row.appendChild(answerCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });

    } catch (error) {

        console.error("LOAD ERROR:", error);

        tableBody.innerHTML =
            '<tr><td colspan="4">Unable to load data.</td></tr>';
    }
}


async function deleteData(id) {

    if (!confirm("Delete this record?")) {
        return;
    }

    try {

        const response = await fetch(
            `${BACKEND_URL}/api/admin/delete/${id}`,
            {
                method: "DELETE"
            }
        );

        const message = await response.text();

        if (!response.ok) {
            throw new Error(message || "Delete failed");
        }

        alert(message);

        await loadData();

    } catch (error) {

        console.error("DELETE ERROR:", error);

        alert("Error: " + error.message);
    }
}


function editData(id, question, answer) {

    editId = id;

    questionInput.value = question;
    answerInput.value = answer;

    questionInput.focus();
}


function clearForm() {

    editId = null;

    questionInput.value = "";
    answerInput.value = "";
}


window.addEventListener("DOMContentLoaded", function () {
    loadData();
});
