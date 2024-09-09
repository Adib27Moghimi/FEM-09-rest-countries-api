import { useState } from "react";

const countriesTempOrgData = [
  {
    Flag: "./Flag-of-Germany.png",
    Name: "Germany",
    Population: 81770900,
    Region: "Europe",
    Capital: "Berlin",
  },
  {
    Flag: "./Flag-of-the-United-States.png",
    Name: "United States of America",
    Population: 323947000,
    Region: "America",
    Capital: "Washington, D.C.",
  },
  {
    Flag: "./Flag-of-Japan.png",
    Name: "Japan",
    Population: 125416877,
    Region: "Asia",
    Capital: "Tokyo",
  },
  {
    Flag: "./Flag-of-New-Zealand.png",
    Name: "New Zealand",
    Population: 5434800,
    Region: "Oceania",
    Capital: "Wellington",
  },
  {
    Flag: "./Flag-of-Nigeria.png",
    Name: "Nigeria",
    Population: 216746934,
    Region: "Africa",
    Capital: "Abuja",
  },
];

const countriesTempSortedData = [...countriesTempOrgData].sort((a, b) => {
  // ignore upper and lowercase
  const regionA = a.Region.toLowerCase();
  const regionB = b.Region.toLowerCase();

  if (regionA < regionB) return -1;
  if (regionA > regionB) return 1;
  return 0;
});

const regionsSortedList = countriesTempSortedData.map(
  (countryData) => countryData.Region
);

const countriesTempLimitedSortedData = countriesTempSortedData.filter(
  (_, i) => i < 8
);

export default function App() {
  const [search, setSearch] = useState("");
  const [regionsSelected, setRegionsSelected] = useState(regionsSortedList);

  function handleSelect(e, region) {
    if (!e.target.classList.contains(region)) return;

    if (e.target.classList.contains("selected")) {
      setRegionsSelected((regionsSelected) =>
        regionsSelected.filter((reg) => reg !== region)
      );
    }

    if (!e.target.classList.contains("selected")) {
      setRegionsSelected((regionsSelected) =>
        [...regionsSelected, region].sort()
      );
    }

    e.target.classList.toggle("selected");
  }

  return (
    <div className="app">
      <Header>
        <ThemeMode />
      </Header>
      <Homepage>
        <SearchInput search={search} setSearch={setSearch} />
        <FilterMenu onSelect={handleSelect} />
        <ShowCountry search={search} regionsSelected={regionsSelected} />
      </Homepage>
    </div>
  );
}

function Header({ children }) {
  return (
    <header className="header">
      <p>Where in the world?</p>
      {children}
    </header>
  );
}

function ThemeMode() {
  const [isDark, setIsDark] = useState(true);

  function handleChangeMode() {
    setIsDark((isDark) => !isDark);
  }

  return (
    <p className="box-mode" onClick={handleChangeMode}>
      <span className={`fas fa-moon ${isDark && "active"}`}></span>
      <span className={`fas fa-sun ${!isDark && "active"}`}></span>
      {isDark ? "Dark Mode" : "Light Mode"}
    </p>
  );
}

function Homepage({ children }) {
  return <main className="Homepage">{children}</main>;
}

function SearchInput({ search, setSearch }) {
  return (
    <div className="box-input">
      <span className="fas fa-search"></span>
      <input
        name="search-input"
        type="text"
        className="search-input"
        placeholder="Search for a country..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

function FilterMenu({ onSelect }) {
  const [isClose, setIsClose] = useState(true);

  function handleToggleMenu() {
    setIsClose((isClose) => !isClose);
  }

  return (
    <nav className="menu">
      <p className="box-title-menu" onClick={handleToggleMenu}>
        Filter by Region
        <span className={`fas fa-angle-down ${isClose ? "active" : ""}`}></span>
        <span className={`fas fa-angle-up ${!isClose ? "active" : ""}`}></span>
      </p>
      <ul
        className={`list-region ${isClose ? "hidden" : ""}`}
        onClick={(e) => regionsSortedList.map((region) => onSelect(e, region))}
      >
        {regionsSortedList.map((region) => (
          <li key={region} className={`${region} selected`}>
            {region}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ShowCountry({ search, regionsSelected }) {
  return countriesTempLimitedSortedData.map(
    (countryData) =>
      (search
        ? countryData.Name.toLowerCase().includes(search.toLowerCase())
        : true) &&
      regionsSelected.includes(countryData.Region) && (
        <CountryCard countryData={countryData} key={countryData.Name} />
      )
  );
}

function CountryCard({ countryData }) {
  return (
    <div className="country-card" key={countryData.Name}>
      <div className="box-img">
        <img src={countryData.Flag} alt="country-flag" />
      </div>
      <section className="card-body">
        <h3>{countryData.Name}</h3>
        <p>
          Population:
          <span> {Intl.NumberFormat().format(countryData.Population)}</span>
        </p>
        <p>
          Region:<span> {countryData.Region}</span>
        </p>
        <p>
          Capital:<span> {countryData.Capital}</span>
        </p>
      </section>
    </div>
  );
}
