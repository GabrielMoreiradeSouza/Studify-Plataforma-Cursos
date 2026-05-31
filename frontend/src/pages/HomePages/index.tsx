export const HomePages = () => {
  return (
    <div style={{ backgroundColor: "#121214", minHeight: "100vh" }}>
      <div
        style={{
          position: "relative",
          backgroundImage: "url('/Lobos.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "520px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 0,
          }}
        />

        <div
          className="d-flex flex-column align-items-center text-center"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "120px 20px 60px",
            color: "#fff",
          }}
        >
          <h3>Cursos de Web Design, UX/UI <br /> Design, HTML, CSS,<br /> JavaScript, TS, Node e React</h3>
          <div
            style={{
              width: "40px",
              height: "2px",
              backgroundColor: "#fff",
              margin: "20px 0",
            }}
          />
          <p style={{ color: "#b1adadff" }}>Aprenda do zero Web Design e comece a sua carreira <br /> de <span style={{ color: "#295bf1ff" }}> UX / UI Designer </span> e Desenvolvedor(a) <span style={{ color: "#fe7d13ff" }}>Front End.</span><br /> Mais de 1600 aulas divididas em 25 cursos.</p>

          <button className="btn btn-primary">Inscreva-se Agora ►</button>

          <div className="card text-bg-dark" style={{ marginTop: "40px", minWidth: "600px", backgroundColor: "#22252a", border: "none" }}>
            <div className="card-body p-4">
              <div className="row g-0">
                <div className="col-md-6" style={{ borderRight: "1px solid #3a3b3c" }}>
                  <div className="d-flex justify-content-end align-items-center gap-3" style={{ padding: "12px 20px", borderBottom: "1px solid #3a3b3c" }}>
                    <span style={{ fontFamily: "monospace", fontStyle: "italic", color: "#c9c9c9" }}>Certificado de Conclusão</span>
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#7ec813", borderRadius: "50%", border: "1px solid #111" }}></div>
                  </div>
                  <div className="d-flex justify-content-end align-items-center gap-3" style={{ padding: "12px 20px", borderBottom: "1px solid #3a3b3c" }}>
                    <span style={{ fontFamily: "monospace", fontStyle: "italic", color: "#c9c9c9" }}>Suporte as Dúvidas</span>
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#7ec813", borderRadius: "50%", border: "1px solid #111" }}></div>
                  </div>
                  <div className="d-flex justify-content-end align-items-center gap-3" style={{ padding: "12px 20px", borderBottom: "1px solid #3a3b3c" }}>
                    <span style={{ fontFamily: "monospace", fontStyle: "italic", color: "#c9c9c9" }}>Mais de 1600 Aulas</span>
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#7ec813", borderRadius: "50%", border: "1px solid #111" }}></div>
                  </div>
                  <div className="d-flex justify-content-end align-items-center gap-3" style={{ padding: "12px 20px" }}>
                    <span style={{ fontFamily: "monospace", fontStyle: "italic", color: "#c9c9c9" }}>Crie projetos na prática</span>
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#7ec813", borderRadius: "50%", border: "1px solid #111" }}></div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-start align-items-center gap-3" style={{ padding: "12px 20px", borderBottom: "1px solid #3a3b3c" }}>
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#7ec813", borderRadius: "50%", border: "1px solid #111", flexShrink: 0 }}></div>
                    <span style={{ fontFamily: "monospace", fontStyle: "italic", color: "#c9c9c9", whiteSpace: "nowrap" }}>Total de Alunas/Alunos: 51.544</span>
                  </div>
                  <div className="d-flex justify-content-start align-items-center gap-3" style={{ padding: "12px 20px", borderBottom: "1px solid #3a3b3c" }}>
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#7ec813", borderRadius: "50%", border: "1px solid #111", flexShrink: 0 }}></div>
                    <span style={{ fontFamily: "monospace", fontStyle: "italic", color: "#c9c9c9", whiteSpace: "nowrap" }}>Inscritos: 60.100</span>
                  </div>
                  <div className="d-flex justify-content-start align-items-center gap-3" style={{ padding: "12px 20px", borderBottom: "1px solid #3a3b3c" }}>
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#7ec813", borderRadius: "50%", border: "1px solid #111", flexShrink: 0 }}></div>
                    <span style={{ fontFamily: "monospace", fontStyle: "italic", color: "#c9c9c9", whiteSpace: "nowrap" }}>Avaliações: 5/5 Estrelas</span>
                  </div>
                  <div className="d-flex justify-content-start align-items-center gap-3" style={{ padding: "12px 20px" }}>
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#7ec813", borderRadius: "50%", border: "1px solid #111", flexShrink: 0 }}></div>
                    <span style={{ fontFamily: "monospace", fontStyle: "italic", color: "#c9c9c9", whiteSpace: "nowrap" }}>Novo: Back End Node.js</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center text-center" style={{ position: "relative", zIndex: 1, padding: "20px", color: "#fff" }}>
          <h3>Cursos</h3>
          <p style={{ color: "#b1adadff" }}>Os cursos da Origamid são voltados para o desenvolvimento web e divididos<br /> em duas categorias: Front End e UX/UI Design. Abaixo estão os principais<br /> cursos, seguidos por uma lista com os 24 cursos disponíveis.</p>
        </div>
      </div>
    </div>
  );
};