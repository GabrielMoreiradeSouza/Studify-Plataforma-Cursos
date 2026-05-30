export default function LoginPages() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="w-100 d-flex flex-column align-items-center" style={{ maxWidth: "400px" }}>

                <img
                    src="/Logo.png"
                    alt="Logo Studify"
                    className="img-fluid"
                    style={{ maxWidth: '250px' }}
                />

                <div className="mb-3 w-100">
                    <label htmlFor="inputEmail" className="form-label">Email</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputEmail"
                        placeholder="Ex.: joao@email.com"
                    />
                </div>
                <div className="mb-3 w-100">
                    <label htmlFor="inputPassword" className="form-label">Senha</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder="Ex.: joao123" />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
                <p className="mt-3">Não tem uma conta? <a href="/register">Registre-se</a></p>
            </div>
        </div>
    );
}