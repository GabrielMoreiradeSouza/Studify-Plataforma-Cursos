package com.br.gabriel.api.repository;

import com.br.gabriel.api.entity.Certificado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CertificadoRepository extends JpaRepository<Certificado, UUID> {

    List<Certificado> findByUsuario_IdUsuarioOrderByDataEmissaoDesc(UUID idUsuario);

    boolean existsByUsuario_IdUsuarioAndCurso_IdCursoAndTrilhaIsNull(UUID idUsuario, UUID idCurso);

    boolean existsByUsuario_IdUsuarioAndTrilha_IdTrilha(UUID idUsuario, UUID idTrilha);

    void deleteByTrilha_IdTrilha(UUID idTrilha);
}
