package com.mycompany.backend.model.openAI.response;

import lombok.*;

import java.util.ArrayList;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Response {
    private String id;
    private long created_at;
    private String status;
    private long completed_at;
    private ErrorResponse error;
    private IncompleteDetails incomplete_details;
    private String instructions;
    private int max_output_tokens;
    private String model;
    private ArrayList<Output> output;
    private boolean parallel_tool_calls;
    private String previous_response_id;
    private Map<String, String> reasoning;
    private boolean store;
}