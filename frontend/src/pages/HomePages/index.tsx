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
          <p style={{ color: "#b1adadff" }}>Os cursos da Studify são voltados para o desenvolvimento web e divididos<br /> em duas categorias: Front End e UX/UI Design. Abaixo estão os principais<br /> cursos, seguidos por uma lista com os 24 cursos disponíveis.</p>
        </div>

        <div className="d-flex justify-content-center align-items-start" style={{ padding: "40px", gap: "60px", color: "#ffffff", backgroundColor: "#121214" }}>

          <div className="d-flex flex-column align-items-center" style={{ gap: "45px" }}>

            <h2 style={{ color: "#f8cb00", margin: "0 0 -10px 0", fontWeight: "bold", fontSize: "2rem" }}>FRONT END</h2>

            <div className="card text-center" style={{ width: "380px", height: "220px", backgroundColor: "#1e2124", borderRadius: "12px", border: "none", boxShadow: "0px 10px 20px rgba(0,0,0,0.3)", position: "relative", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#000", padding: "5px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", border: "1px solid #ffae00", color: "#ffae00" }}>
                HTML
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ padding: "40px 20px 20px 20px" }}>
                <div className="d-flex flex-grow-1 align-items-center justify-content-center">
                  <h5 className="card-title text-white m-0" style={{ fontSize: "1.3rem" }}>HTML e CSS para Iniciantes</h5>
                </div>
                <div className="d-flex justify-content-center align-items-center pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "14px", color: "#888" }}>
                  <span>aulas 164</span>
                  <div style={{ width: "1px", height: "14px", backgroundColor: "#ffae00", margin: "0 10px" }}></div>
                  <span>23 horas</span>
                </div>
              </div>
            </div>

            <div className="card text-center" style={{ width: "380px", height: "220px", backgroundColor: "#1e2124", borderRadius: "12px", border: "none", boxShadow: "0px 10px 20px rgba(0,0,0,0.3)", position: "relative", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#000", padding: "5px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", border: "1px solid #4ade80", color: "#4ade80" }}>
                TAILWIND
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ padding: "40px 20px 20px 20px" }}>
                <div className="d-flex flex-grow-1 align-items-center justify-content-center">
                  <h5 className="card-title text-white m-0" style={{ fontSize: "1.3rem" }}>Tailwind CSS</h5>
                </div>
                <div className="d-flex justify-content-center align-items-center pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "14px", color: "#888" }}>
                  <span>aulas 66</span>
                  <div style={{ width: "1px", height: "14px", backgroundColor: "#4ade80", margin: "0 10px" }}></div>
                  <span>8 horas</span>
                </div>
              </div>
            </div>

            <div className="card text-center" style={{ width: "380px", height: "220px", backgroundColor: "#1e2124", borderRadius: "12px", border: "none", boxShadow: "0px 10px 20px rgba(0,0,0,0.3)", position: "relative", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#000", padding: "5px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", border: "1px solid #f8cb00", color: "#f8cb00" }}>
                JAVASCRIPT
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ padding: "40px 20px 20px 20px" }}>
                <div className="d-flex flex-grow-1 align-items-center justify-content-center">
                  <h5 className="card-title text-white m-0" style={{ fontSize: "1.3rem" }}>JavaScript Completo ES6</h5>
                </div>
                <div className="d-flex justify-content-center align-items-center pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "14px", color: "#888" }}>
                  <span>aulas 156</span>
                  <div style={{ width: "1px", height: "14px", backgroundColor: "#f8cb00", margin: "0 10px" }}></div>
                  <span>37 horas</span>
                </div>
              </div>
            </div>

          </div>

          <div className="d-flex flex-column align-items-center" style={{ gap: "45px" }}>

            <h2 style={{ color: "#a200f8", margin: "0 0 -10px 0", fontWeight: "bold", fontSize: "2rem" }}>UI DESIGN</h2>

            <div className="card text-center" style={{ width: "380px", height: "220px", backgroundColor: "#1e2124", borderRadius: "12px", border: "none", boxShadow: "0px 10px 20px rgba(0,0,0,0.3)", position: "relative", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#000", padding: "5px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", border: "1px solid #a200f8", color: "#a200f8" }}>
                DESIGN
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ padding: "40px 20px 20px 20px" }}>
                <div className="d-flex flex-grow-1 align-items-center justify-content-center">
                  <h5 className="card-title text-white m-0" style={{ fontSize: "1.3rem" }}>UI Design para Iniciantes</h5>
                </div>
                <div className="d-flex justify-content-center align-items-center pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "14px", color: "#888" }}>
                  <span>aulas 155</span>
                  <div style={{ width: "1px", height: "14px", backgroundColor: "#a200f8", margin: "0 10px" }}></div>
                  <span>17 horas</span>
                </div>
              </div>
            </div>

            <div className="card text-center" style={{ width: "380px", height: "220px", backgroundColor: "#1e2124", borderRadius: "12px", border: "none", boxShadow: "0px 10px 20px rgba(0,0,0,0.3)", position: "relative", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#000", padding: "5px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", border: "1px solid #4ade80", color: "#4ade80" }}>
                FLEX
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ padding: "40px 20px 20px 20px" }}>
                <div className="d-flex flex-grow-1 align-items-center justify-content-center">
                  <h5 className="card-title text-white m-0" style={{ fontSize: "1.3rem" }}>CSS Flexbox</h5>
                </div>
                <div className="d-flex justify-content-center align-items-center pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "14px", color: "#888" }}>
                  <span>aulas 25</span>
                  <div style={{ width: "1px", height: "14px", backgroundColor: "#4ade80", margin: "0 10px" }}></div>
                  <span>3 horas</span>
                </div>
              </div>
            </div>

            <div className="card text-center" style={{ width: "380px", height: "220px", backgroundColor: "#1e2124", borderRadius: "12px", border: "none", boxShadow: "0px 10px 20px rgba(0,0,0,0.3)", position: "relative", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#000", padding: "5px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", border: "1px solid #4ade80", color: "#4ade80" }}>
                GRID
              </div>
              <div className="card-body d-flex flex-column justify-content-between" style={{ padding: "40px 20px 20px 20px" }}>
                <div className="d-flex flex-grow-1 align-items-center justify-content-center">
                  <h5 className="card-title text-white m-0" style={{ fontSize: "1.3rem" }}>CSS Grid Layout</h5>
                </div>
                <div className="d-flex justify-content-center align-items-center pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "14px", color: "#888" }}>
                  <span>aulas 34</span>
                  <div style={{ width: "1px", height: "14px", backgroundColor: "#4ade80", margin: "0 10px" }}></div>
                  <span>5 horas</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};