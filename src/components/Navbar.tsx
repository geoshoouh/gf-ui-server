interface NavbarProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: 'var(--primary-navy)' }}>
            <div className="container-fluid">
                <a className="navbar-brand" href="#" style={{ color: 'var(--accent-yellow)' }}>
                <img
                    src="/src/assets/gfp.webp"
                    alt="Brand Logo"
                    width="30"
                    height="30"
                    className="d-inline-block align-top me-2"
                />
                Genesis Training Manager
                </a>
                
                {/* Right-aligned hamburger menu */}
                <div className="navbar-nav ms-auto">
                    <div className="nav-item dropdown">
                        <button
                            className="btn btn-link nav-link dropdown-toggle"
                            type="button"
                            id="navbarDropdown"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="true"
                            aria-expanded="false"
                            style={{ color: 'var(--accent-yellow)', border: 'none', background: 'none' }}
                        >
                            <i className="bi bi-list fs-4"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li>
                                <button
                                    className={`dropdown-item ${currentView === 'exercise' ? 'active' : ''}`}
                                    onClick={() => onViewChange('exercise')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Exercise Input
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`dropdown-item ${currentView === 'export' ? 'active' : ''}`}
                                    onClick={() => onViewChange('export')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="bi bi-download me-2"></i>
                                    Export History
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`dropdown-item ${currentView === 'bulk-upload' ? 'active' : ''}`}
                                    onClick={() => onViewChange('bulk-upload')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="bi bi-upload me-2"></i>
                                    Bulk Upload
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
} 


export default Navbar;