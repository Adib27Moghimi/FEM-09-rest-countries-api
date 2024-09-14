import { useState } from "react";

//// ! ///////////////////////////////
const res = await fetch(`https://restcountries.com/v3.1/all`);
const dataArr = await res.json();

const countriesData = dataArr
  .filter((_, i) => i < 15)
  .map((el) => {
    const [nativeNameObj] = Object.values(el.name.nativeName);
    const [Capital] = el.capital;
    const [CurrenciesObj] = Object.values(el.currencies);
    return {
      Flag: el.flags.svg,
      Name: el.name.common,
      NativeName: nativeNameObj.common,
      Population: el.population,
      Region: el.region,
      Subregion: el.subregion,
      Capital,
      TopLevelDomain: el.tld,
      Currencies: CurrenciesObj.name,
      LanguagesObj: el.languages,
    };
  });

//// ! /////////////////////////////////
// const countriesData = [
//   {
//     Flag: "./Flag-of-Germany.png",
//     Name: "Germany",
//     Population: 81770900,
//     Region: "Europe",
//     Capital: "Berlin",
//   },
//   {
//     Flag: "./Flag-of-the-United-States.png",
//     Name: "United States of America",
//     Population: 323947000,
//     Region: "America",
//     Capital: "Washington, D.C.",
//   },
//   {
//     Flag: "./Flag-of-Japan.png",
//     Name: "Japan",
//     Population: 125416877,
//     Region: "Asia",
//     Capital: "Tokyo",
//   },
//   {
//     Flag: "./Flag-of-New-Zealand.png",
//     Name: "New Zealand",
//     Population: 5434800,
//     Region: "Oceania",
//     Capital: "Wellington",
//   },
//   {
//     Flag: "./Flag-of-Nigeria.png",
//     Name: "Nigeria",
//     Population: 216746934,
//     Region: "Africa",
//     Capital: "Abuja",
//   },
// ];
//// ! ////////////////////////////////

const DataOfCountriesSortedByTheirName = [...countriesData].sort((a, b) => {
  // ignore upper and lowercase
  const NameA = a.Name.toLowerCase();
  const NameB = b.Name.toLowerCase();

  if (NameA < NameB) return -1;
  if (NameA > NameB) return 1;
  return 0;
});

const DataOfRegions = countriesData.map((country) => country.Region);

const UniqueDataOfRegions = [...new Set(DataOfRegions)];

const SortedUniqueDataOfRegions = [...UniqueDataOfRegions].sort((a, b) => {
  // ignore upper and lowercase
  const RegionA = a.toLowerCase();
  const RegionB = b.toLowerCase();

  if (RegionA < RegionB) return -1;
  if (RegionA > RegionB) return 1;
  return 0;
});

export default function App() {
  const [search, setSearch] = useState("");
  const [regionsSelected, setRegionsSelected] = useState(
    SortedUniqueDataOfRegions
  );
  const [isCloseDetail, setIsCloseDetail] = useState(true);
  const [eventCurrentTargetId, setEventCurrentTargetId] = useState("");

  const countryFilterData = DataOfCountriesSortedByTheirName.filter(
    (countryData) =>
      (search
        ? countryData.Name.toLowerCase().includes(search.toLowerCase())
        : true) && regionsSelected.includes(countryData.Region)
  );

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

  function handleCloseDetailPage() {
    setIsCloseDetail(true);
  }

  function handleOpenDetailPage(e, countryData) {
    if (e.currentTarget.id === countryData.Name) {
      setIsCloseDetail(false);
      setEventCurrentTargetId(e.currentTarget.id);
    }
  }

  return (
    <div className="app">
      <Header>
        <ThemeMode />
      </Header>
      {isCloseDetail ? (
        <Homepage>
          <SearchInput search={search} setSearch={setSearch} />
          <FilterMenu onSelect={handleSelect} />
          {countryFilterData.map((countryData) => (
            <CountryCard
              countryData={countryData}
              key={countryData.Name}
              onOpenDetailPage={handleOpenDetailPage}
            />
          ))}
        </Homepage>
      ) : (
        <DetailPage>
          <BackButton onCloseDetailPage={handleCloseDetailPage} />
          <CountryDetailCard eventCurrentTargetId={eventCurrentTargetId} />
        </DetailPage>
      )}
    </div>
  );
}

function CountryDetailCard({ eventCurrentTargetId }) {
  const [countryDetailFilterData = {}] =
    DataOfCountriesSortedByTheirName.filter(
      (countryData) =>
        countryData.Name.toLowerCase() === eventCurrentTargetId.toLowerCase()
    );
  const countryData = countryDetailFilterData;

  return (
    <div className="country-card country-detail-card" key={countryData.Name}>
      <div className="box-img">
        <img src={countryData.Flag} alt={`${countryData.Name} country Flag`} />
      </div>
      <section className="card-body">
        <h3>{countryData.Name}</h3>
        <div className="basic-information">
          <p>
            Native Name:<span> {countryData.NativeName}</span>
          </p>
          <p>
            Population:
            <span> {Intl.NumberFormat().format(countryData.Population)}</span>
          </p>
          <p>
            Region:<span> {countryData.Region}</span>
          </p>
          <p>
            Sub Region:<span> {countryData.Subregion}</span>
          </p>
          <p>
            Capital:<span> {countryData.Capital}</span>
          </p>
        </div>
        <div className="more-information">
          <p>
            Top Level Domain:<span> {countryData.TopLevelDomain}</span>
          </p>
          <p>
            Currencies:<span> {countryData.Currencies}</span>
          </p>
          <p>{/* Languages:<span>{countryData.LanguagesObj}</span> */}</p>
        </div>
        <div className="border-countries">
          <h4 className="title-border-countries">Border Countries</h4>
          <ul className="box-border-countries">
            <li>
              <button>D1</button>
            </li>
            <li>
              <button>D2</button>
            </li>
            <li>
              <button>D3</button>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function BackButton({ onCloseDetailPage }) {
  return (
    <button className="BackButton" onClick={onCloseDetailPage}>
      <span>X</span>Back
    </button>
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
        onClick={(e) =>
          SortedUniqueDataOfRegions.map((region) => onSelect(e, region))
        }
      >
        {/* //// ! این مورد کی رو بعدا درست کنم */}
        {SortedUniqueDataOfRegions.map((region, index) => (
          <li key={index} className={`${region} selected`}>
            {region}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function CountryCard({ countryData, onOpenDetailPage }) {
  return (
    <div
      id={countryData.Name}
      className="country-card"
      key={countryData.Name}
      onClick={(e) => onOpenDetailPage(e, countryData)}
    >
      <div className="box-img">
        <img src={countryData.Flag} alt={`${countryData.Name} country Flag`} />
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

function DetailPage({ children }) {
  return <main className="Detail-Page">{children}</main>;
}
