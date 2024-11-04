package org.kkotlyarenko.weblab2.utils;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ErrorHandler {
    public static void sendError(HttpServletResponse response, String errorMessage, int errorCode) throws IOException {
        var json = new Gson().newBuilder().disableHtmlEscaping().create();
        Map<String, Object> jsonResponse = new HashMap<>() {{
            put("error", errorMessage);
        }};

        response.setContentType("application/json");
        response.getWriter().write(json.toJson(jsonResponse));
        response.setStatus(errorCode);
    }
}
