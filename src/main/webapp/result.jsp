<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="org.kkotlyarenko.weblab2.models.Result" %>
<%@ page import="java.util.List" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="${pageContext.request.contextPath}/css/style.css" rel="stylesheet" >
  <title>Results</title>
</head>
<body>
<header>Full Name: Kotlyarenko K.A.<br>Group: P3209<br>Variant: 408878</header>

<div class="container">

  <h2>Point Check Result</h2>

  <table id="resultsTable">
    <thead>
    <tr><th>X</th><th>Y</th><th>R</th><th>Result</th><th>Request Time</th></tr>
    </thead>
    <tbody>
    <% for (Result point : (List<Result>) application.getAttribute("points")) { %>
    <tr>
      <td><%= point.getX() %></td>
      <td><%= point.getY() %></td>
      <td><%= point.getR() %></td>
      <td><%= point.isHit() ? "Hit" : "Miss" %></td>
      <td><%= new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date(point.getTimestamp() * 1000)) %></td>
    </tr>
    <% } %>
    </tbody>
  </table>

  <div class="form-group">
    <input type="button" class="submit-button" onclick="location.href='${pageContext.request.contextPath}';" value="Back to form" />
  </div>
</div>
</body>
</html>
