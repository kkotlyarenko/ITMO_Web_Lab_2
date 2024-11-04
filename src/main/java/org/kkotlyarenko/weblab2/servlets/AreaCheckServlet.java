package org.kkotlyarenko.weblab2.servlets;

import jakarta.servlet.ServletContext;
import org.kkotlyarenko.weblab2.models.Result;
import org.kkotlyarenko.weblab2.utils.ErrorHandler;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/app/check")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, IllegalArgumentException {
        int xParam;
        double yParam, rParam;

        try {
            xParam = Integer.parseInt(request.getParameter("x"));
            yParam = Double.parseDouble(request.getParameter("y"));
            rParam = Double.parseDouble(request.getParameter("r"));

            validateData(request.getParameter("x"), request.getParameter("y"), request.getParameter("r"), request.getParameter("action"));
        } catch (IllegalArgumentException e) {
            ErrorHandler.sendError(response, e.getMessage(), 422);
            return;
        }

        boolean isHit = checkHit(xParam, yParam, rParam);

        Result point = new Result(xParam, yParam, rParam, isHit);

        ServletContext selvletContext = getServletContext();
        List<Result> points = (List<Result>) selvletContext.getAttribute("points");
        if (points == null) {
            points = new ArrayList<>();
            selvletContext.setAttribute("points", points);
        }
        points.add(0, point);

        String action = request.getParameter("action");

        if ("submitForm".equals(action)) {
            getServletContext().getRequestDispatcher("/result.jsp").forward(request, response);

        } else if ("checkPoint".equals(action)) {
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();

            Gson gson = new Gson();
            out.print(gson.toJson(point));
            out.flush();
        }
    }

    private void validateData(String xParam, String yParam, String rParam, String action) throws IllegalArgumentException {

        if (xParam == null || xParam.isEmpty()) {
            throw new IllegalArgumentException("The 'x' parameter is missing or empty.");
        }
        if (yParam == null || yParam.isEmpty()) {
            throw new IllegalArgumentException("The 'y' parameter is missing or empty.");
        }
        if (rParam == null || rParam.isEmpty()) {
            throw new IllegalArgumentException("The 'r' parameter is missing or empty.");
        }
        if (action == null || action.isEmpty()) {
            throw new IllegalArgumentException("The 'action' parameter is missing or empty.");
        }

        if (!isValidInteger(xParam, -5, 3)) {
            throw new IllegalArgumentException("Invalid or out-of-bounds 'x' parameter.");
        }
        if (!isValidDouble(yParam, -3, 3)) {
            throw new IllegalArgumentException("Invalid or out-of-bounds 'y' parameter.");
        }
        if (!isValidDouble(rParam, 1, 3)) {
            throw new IllegalArgumentException("Invalid or out-of-bounds 'r' parameter.");
        }
        if (!action.equals("submitForm") && !action.equals("checkPoint")) {
            throw new IllegalArgumentException("Invalid 'action' parameter.");
        }
    }

    private boolean isValidInteger(String value, int min, int max) {
        try {
            int intValue = Integer.parseInt(value);
            return intValue >= min && intValue <= max;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean isValidDouble(String value, double min, double max) {
        try {
            double floatValue = Double.parseDouble(value);
            return floatValue >= min && floatValue <= max;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean checkHit(double x, double y, double r) {
        if (x >= 0 && y >= 0){
            return x <= r / 2 && y <= r;
        } else if (x >= 0 && y <= 0){
            return x * x + y * y <= r * r / 4;
        } else if (x <= 0 && y <= 0){
            return x >= -r / 2 && y >= -r / 2 && x + r / 2 >= -y;
        }
        return false;
    }
}