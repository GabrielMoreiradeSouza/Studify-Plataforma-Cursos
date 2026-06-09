package com.br.gabriel.api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProgressoResponse(
        UUID idProgresso,
        UUID idLesson,
        Boolean completado,
        LocalDateTime dataConclusao
) {
}
