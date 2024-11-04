package org.kkotlyarenko.weblab2.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

import org.kkotlyarenko.weblab2.utils.ErrorHandler;

@WebServlet("/controller")
public class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        if (request.getParameter("x") != null &&
                request.getParameter("y") != null &&
                request.getParameter("r") != null &&
                request.getParameter("action") != null) {

            try {
                request.getRequestDispatcher("/app/check").forward(request, response);
            } catch (Exception e) {
                ErrorHandler.sendError(response, e.getMessage(), 500);
            }
            return;
        }
        getServletContext().getRequestDispatcher("/index.jsp").forward(request, response);
    }
}