export default function App() {
  return (
    <div className="app">
      <main className="Homepage">
        <header className="header">
          <p>Where in the world?</p>
          <p className="box-mode">
            <span className="fas fa-moon active"></span>
            <span className="fas fa-sun"></span>
            Dark Mode
          </p>
        </header>
        <section className="main-section">
          <div className="box-input">
            <span className="fas fa-search"></span>
            <input
              name="search-input"
              type="text"
              className="search-input"
              placeholder="Search for a country..."
            />
          </div>
          <nav className="menu">
            <p className="box-title-menu">
              Filter by Region
              <span className="fas fa-angle-down active"></span>
              <span className="fas fa-angle-up"></span>
            </p>
            <ul className="list-region hidden">
              <li>Africa</li>
              <li>America</li>
              <li>Asia</li>
              <li>Europe</li>
              <li>Oceania</li>
            </ul>
          </nav>
          <div className="country-card">
            <div className="box-img">
              <img src="./Flag-of-Germany.png" alt="country-flag" />
            </div>
            <section className="card-body">
              <h3>Germany</h3>
              <p>
                Population: <span>81.770.900</span>
              </p>
              <p>
                Region: <span>Europe</span>
              </p>
              <p>
                Capital: <span>Berlin</span>
              </p>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
