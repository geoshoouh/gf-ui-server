
const Navbar: React.FC = () => {

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                <img
                    src="/src/assets/gfp.webp"
                    alt="Brand Logo"
                    width="30"
                    height="30"
                    className="d-inline-block align-top me-2"
                />
                Genesis Training Manager
                </a>
                <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <span className="navbar-toggler-icon"></span>
                </button>
            </div>
        </nav>
    );
} 


export default Navbar;