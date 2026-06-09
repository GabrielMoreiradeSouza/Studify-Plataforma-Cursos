package com.br.gabriel.api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record LessonResponse(
        UUID idLesson,
        UUID idCurso,
        String titulo,
        String s3Key,
        Integer duracaoSegundos,
        Integer ordem,
        LocalDateTime dataUpload
) {
}
