function getCurrentRValue() {
    const rInput = document.querySelector('input[name="r"]:checked');
    return rInput ? parseFloat(rInput.value) : null;
}

document.getElementById("dataForm").onsubmit = function (e) {
    e.preventDefault();
    var yValue = parseFloat(document.getElementById("y").value);
    var rValue = getCurrentRValue();

    document.getElementById("yError").textContent = "";
    document.getElementById("rError").textContent = "";

    var isValid = true;

    if (isNaN(yValue) || yValue < -5 || yValue > 3) {
        document.getElementById("yError").textContent = "Enter a valid Y value (-5 ... 3)";
        isValid = false;
    }
    if (isNaN(rValue) || rValue < 1 || rValue > 3) {
        document.getElementById("rError").textContent = "Select an R value (1 ... 3)";
        isValid = false;
    }

    if (isValid) e.target.submit();
};

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const axisRange = 7;

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rValue = getCurrentRValue();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const unitScale = canvas.width / axisRange;

    drawAxes(unitScale);
    drawLabels(unitScale);

    if (!rValue) {
        return;
    }

    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
        centerX,
        centerY,
        unitScale * rValue / 2,
        0,
        0.5 * Math.PI,
        false
    );
    ctx.closePath();
    ctx.fill();

    ctx.fillRect(
        centerX,
        centerY - unitScale * rValue,
        unitScale * rValue / 2,
        unitScale * rValue
    );

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - unitScale * (rValue / 2), centerY);
    ctx.lineTo(centerX, centerY + unitScale * (rValue / 2));
    ctx.closePath();
    ctx.fill();
}

function drawAxes(unitScale) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - 10, centerY - 5);
    ctx.lineTo(canvas.width, centerY);
    ctx.lineTo(canvas.width - 10, centerY + 5);
    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.stroke();
}

function drawLabels(unitScale) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';

    ctx.textBaseline = 'middle';

    for (let i = -4; i <= 4; i++) {
        if (i === 0) continue;
        const x = centerX + i * unitScale;
        ctx.beginPath();
        ctx.moveTo(x, centerY - 5);
        ctx.lineTo(x, centerY + 5);
        ctx.stroke();

        let labelOffsetY = centerY + 15;

        if (i === -4) {
            ctx.textAlign = 'left';
            ctx.fillText(i.toString(), x + 5, labelOffsetY);
        } else if (i === 4) {
            ctx.textAlign = 'right';
            ctx.fillText(i.toString(), x - 5, labelOffsetY);
        } else {
            ctx.textAlign = 'center';
            ctx.fillText(i.toString(), x, labelOffsetY);
        }
    }

    for (let i = -4; i <= 4; i++) {
        if (i === 0) continue;
        const y = centerY - i * unitScale;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, y);
        ctx.lineTo(centerX + 5, y);
        ctx.stroke();

        let labelOffsetX = centerX + 15;

        if (i === 4) {
            ctx.textBaseline = 'top';
            ctx.fillText(i.toString(), labelOffsetX, y + 5);
        } else if (i === -4) {
            ctx.textBaseline = 'bottom';
            ctx.fillText(i.toString(), labelOffsetX, y - 5);
        } else {
            ctx.textBaseline = 'middle';
            ctx.fillText(i.toString(), labelOffsetX, y);
        }
    }
}

function drawPoint(x, y, isHit) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const unitScale = canvas.width / axisRange;

    const pixelX = centerX + x * unitScale;
    const pixelY = centerY - y * unitScale;

    ctx.fillStyle = isHit ? `rgb(158 255 92)` : 'red';
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, 3, 0, 2 * Math.PI);
    ctx.fill();
}

function drawPreviousPoints() {
    const table = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];
    const rows = table.rows;
    const selectedR = getCurrentRValue();
    if (!selectedR) {
        return;
    }

    for (let i = 0; i < rows.length; i++) {
        const x = parseInt(rows[i].cells[0].innerText);
        const y = parseFloat(rows[i].cells[1].innerText);
        const r = parseFloat(rows[i].cells[2].innerText);
        const hit = rows[i].cells[3].innerText === "Hit";
        if (selectedR === r) {
            drawPoint(x, y, hit);
        }
    }
}

canvas.addEventListener('click', function (event) {
    const rValue = getCurrentRValue();

    if (!rValue) {
        alert("Please select a value for R first.");
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const unitScale = canvas.width / axisRange;

    let graphX = (x - centerX) / unitScale;
    let graphY = (centerY - y) / unitScale;

    graphX = Math.round(graphX);

    fetch(`app?x=${graphX}&y=${graphY.toFixed(2)}&r=${rValue}&action=checkPoint`, {
            method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                alert(`Server error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            drawPoint(graphX, graphY, data.hit);
            addResultToTable(data);
        });
});

function addResultToTable(result) {
    const table = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(0);

    const xCell = newRow.insertCell(0);
    const yCell = newRow.insertCell(1);
    const rCell = newRow.insertCell(2);
    const resultCell = newRow.insertCell(3);
    const dateCell = newRow.insertCell(4);

    xCell.innerText = Math.round(result.x).toString();
    yCell.innerText = result.y.toFixed(2);
    rCell.innerText = result.r.toFixed(1);
    resultCell.innerText = result.hit ? "Hit" : "Miss";
    dateCell.innerText = new Date(result.timestamp * 1000).toLocaleString();
}

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawGraph();
    drawPreviousPoints();
}

document.querySelectorAll('input[name="r"]').forEach(radio => {
    radio.addEventListener('click', () => {
        drawGraph();
        drawPreviousPoints();
    });
});

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);