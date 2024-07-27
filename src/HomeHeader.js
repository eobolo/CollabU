import { Link } from "react-router-dom";
const HomeHeader = () => {
    return (
        <header>
            <nav>
                <ul className="nav-list">
                    <li className="nav-links"><Link to="/">Login</Link></li>
                    <li className="nav-links"><Link to="/signup">Sign Up</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default HomeHeader