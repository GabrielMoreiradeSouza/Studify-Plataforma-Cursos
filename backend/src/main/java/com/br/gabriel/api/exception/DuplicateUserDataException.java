package com.br.gabriel.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateUserDataException extends RuntimeException {
    public DuplicateUserDataException(String message) {
        super(message);
    }
}
