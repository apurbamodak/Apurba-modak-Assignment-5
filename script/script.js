const issuesContainer = document.getElementById("issuesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const searchInput = document.getElementById("searchInput");
const allIssuesBtn = document.getElementById("allIssuesBtn");
const openIssuesBtn = document.getElementById("openIssuesBtn");
const closedIssuesBtn = document.getElementById("closedIssuesBtn");
const issueCount = document.getElementById("issueCount");
const issueModal = document.getElementById("issueModalDetails");


let allIssues = [];

function showLoading() {
    loadingSpinner.classList.remove("hidden");
    issuesContainer.innerHTML = "";
}

function hideLoading() {
    loadingSpinner.classList.add("hidden");
}

async function loadIssues() {
    showLoading();
    const res = await fetch(
        "https://phi-lab-server.vercel.app/api/v1/lab/issues"
    );
    const data = await res.json();
    allIssues = data.data;
    displayIssues(allIssues);
    hideLoading();
}


function displayIssues(issues) {
    issuesContainer.innerHTML = "";
    issueCount.textContent = `${issues.length} Issues`;
    issues.forEach(issue => {
        const card = document.createElement("div");
        const borderColor =
            issue.status === "open"
                ? "border-green-500"
                : "border-purple-500";
        card.className =
            `card bg-white shadow-sm border-t-4 ${borderColor}`;
        card.innerHTML = `
        <div class="card-body">
         <div class="flex justify-end">
            <span class="badge ${issue.priority === "high"
                ? "bg-red-100 text-red-600"
                : issue.priority === "medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-200 text-gray-600"}">
            ${issue.priority.toUpperCase()}</span>
         </div>
        <h2
        class="card-title cursor-pointer hover:text-blue-600"
        data-id="${issue._id}"
        >
        ${issue.title}
        </h2>
        <p class="line-clamp-2 overflow-hidden">
        ${issue.description}
        </p>
        <div class="flex flex-wrap gap-2 text-xs mt-2">
        ${issue.labels.map(label => `
            <span class="badge ${label === "bug"
                            ? "bg-red-100 text-red-600 border-red-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                        } border">${label.toUpperCase()}</span>`
                    ).join("")}
        </div>
        <br>
        <hr>
        <p class="text-xs text-gray-400 mt-2">
        ${issue.author}
        </p>
        <p class="text-xs text-gray-400">
        ${issue.createdAt}
        </p>
        </div>
        `;

        card.addEventListener("click", () => {
            issueModalDetails(issue);
        });
        issuesContainer.appendChild(card);
    });

}


function filterIssues(status, btn) {
    const buttons = [allIssuesBtn, openIssuesBtn, closedIssuesBtn];
    buttons.forEach(button => {
        button.classList.remove("btn-primary");
        button.classList.add("btn-outline");
    });
    btn.classList.add("btn-primary");
    btn.classList.remove("btn-outline");
    if (status === "all") {
        displayIssues(allIssues);
        return;
    }

    const filtered =
        allIssues.filter(issue => issue.status === status);
    displayIssues(filtered);

}


async function searchIssues() {
    const text = searchInput.value;
    if (text === "") {
        loadIssues();
        return;
    }
    showLoading();

    const res = await fetch(
        `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
    );
    const data = await res.json();
    displayIssues(data.data);
    hideLoading();

}


function issueModalDetails(issue) {

    document.getElementById("modalTitle").textContent = issue.title;
    document.getElementById("modalDescription").textContent = issue.description;
    document.getElementById("modalAssignee").textContent = issue.author;

    const priorityBadge = document.getElementById("modalPriority");
    priorityBadge.textContent = issue.priority.toUpperCase();

    priorityBadge.className =
        "badge " +
        (issue.priority === "high"
            ? "bg-red-100 text-red-600"
            : issue.priority === "medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-200 text-gray-600");

    const labelsContainer = document.getElementById("modalLabels");

    labelsContainer.innerHTML = issue.labels.map(label => `
        <span class="badge ${label === "bug"
            ? "bg-red-100 text-red-600 border-red-200"
            : "bg-yellow-100 text-yellow-700 border-yellow-200"
        } border">
        ${label.toUpperCase()}
        </span>
    `).join("");

    issueModal.showModal();
}



allIssuesBtn.addEventListener("click", () => {
    filterIssues("all", allIssuesBtn);
});

openIssuesBtn.addEventListener("click", () => {
    filterIssues("open", openIssuesBtn);
});

closedIssuesBtn.addEventListener("click", () => {
    filterIssues("closed", closedIssuesBtn);
});
searchInput.addEventListener("keyup", searchIssues);

loadIssues();