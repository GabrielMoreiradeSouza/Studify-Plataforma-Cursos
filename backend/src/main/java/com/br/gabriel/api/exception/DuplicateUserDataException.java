package com.br.gabriel.api.exception;

public class DuplicateUserDataException extends RuntimeException {
    public DuplicateUserDataException(String message) {
        super(message);
    }
}
