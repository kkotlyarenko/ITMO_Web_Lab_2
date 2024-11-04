<%@ page import="org.kkotlyarenko.weblab2.models.Result" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check Point</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet" >
</head>
<body>
<header>Full Name: Kotlyarenko K.A.<br>Group: P3209<br>Variant: 408878</header>

<div class="container">
    <h2>Check if a Point Lies Within an Area</h2>

    <div class="graph-container">
        <canvas id="graphCanvas"></canvas>
    </div>

    <form action="${pageContext.request.contextPath}/app" method="get" id="dataForm">
        <div class="form-group">
            <label for="x">Select X:</label>
            <select id="x" name="x">
                <option value="-5">-5</option>
                <option value="-4">-4</option>
                <option value="-3">-3</option>
                <option value="-2">-2</option>
                <option value="-1">-1</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
        </div>

        <div class="form-group">
            <label for="y">Enter Y (-5 ... 3):</label>
            <input type="number" id="y" name="y" placeholder="Enter Y" min="-5" max="3" step="any">
            <span class="error" id="yError"></span>
        </div>

        <div class="form-group">
            <label>Select R:</label>
            <div class="radio-group">
                <label><input type="radio" name="r" value="1">1</label>
                <label><input type="radio" name="r" value="1.5">1.5</label>
                <label><input type="radio" name="r" value="2">2</label>
                <label><input type="radio" name="r" value="2.5">2.5</label>
                <label><input type="radio" name="r" value="3">3</label>
            </div>
            <span class="error" id="rError"></span>
        </div>

        <input type="hidden" name="action" value="submitForm">

        <div class="form-group">
            <button type="submit" class="submit-button">Check</button>
        </div>
    </form>

    <h3>Previous Results</h3>
    <table id="resultsTable">
        <thead>
        <tr><th>X</th><th>Y</th><th>R</th><th>Result</th><th>Request Time</th></tr>
        </thead>
        <tbody>
        <%
            List<Result> points = (List<Result>) application.getAttribute("points");
            if (points != null) {
                for (Result point : points) {
        %>
        <tr>
            <td><%= point.getX() %></td>
            <td><%= point.getY() %></td>
            <td><%= point.getR() %></td>
            <td><%= point.isHit() ? "Hit" : "Miss" %></td>
            <td><%= new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date(point.getTimestamp() * 1000)) %></td>
        </tr>
        <%
            }
        } else {
        %>
        <tr>
        </tr>
        <%
            }
        %>
        </tbody>
    </table>
</div>

<script src="js/script.js"></script>
</body>
</html>
