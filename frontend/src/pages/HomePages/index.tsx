

export const HomePages = () => {
  return (
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
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 0,
        }}
      />

      {/* Content */}
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

        <div className="card text-bg-dark" style={{ marginTop: "40px", minWidth: "600px" }}>
          <div className="card-body">
            <div className="row">

              <div className="col-md-6">
                <p>Certificado de Conclusão</p>
                <p>Suporte as Dúvidas</p>
                <p>Mais de 1600 Aulas</p>
                <p>Crie projetos na prática</p>
              </div>

              <div className="col-md-6">
                <p>Total de Alunas/Alunos: 51.544</p>
                <p>Inscritos: 60.100</p>
                <p>Avaliações: 5/5 Estrelas</p>
                <p>Novo: Back End Node.js</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};