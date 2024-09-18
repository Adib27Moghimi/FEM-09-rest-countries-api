import { useEffect, useState } from "react";

const res = await fetch(`https://restcountries.com/v3.1/all`);
const allCountries = await res.json();

const allCountriesSorted = [...allCountries].sort((a, b) => {
  // ignore upper and lowercase
  const NameA = a.Name?.common.toLowerCase();
  const NameB = b.Name?.common.toLowerCase();

  if (NameA < NameB) return -1;
  if (NameA > NameB) return 1;
  return 0;
});

const restrictingCountriesData = allCountriesSorted.map((el) => getNewData(el));

const regionsData = restrictingCountriesData.map((country) => country.Region);

const UniqueDataOfRegions = [...new Set(regionsData)];

const SortedDataOfRegions = [...UniqueDataOfRegions].sort((a, b) => {
  // ignore upper and lowercase
  const RegionA = a.toLowerCase();
  const RegionB = b.toLowerCase();

  if (RegionA < RegionB) return -1;
  if (RegionA > RegionB) return 1;
  return 0;
});

function getNewData(data) {
  const native = data.name?.nativeName || "does not exist";
  const nativeNameObj =
    typeof native === "string"
      ? native
      : typeof native === "object" && Object.values(native)[0];

  const currencies = data?.currencies || "does not exist";
  const currenciesObj =
    typeof currencies === "string"
      ? currencies
      : typeof currencies === "object" && Object.values(currencies)[0];
  const newData = {
    Flag: data.flags.svg,
    Name: data.name.common,
    NativeName: nativeNameObj?.common || "does not exist",
    Population: data.population,
    Region: data.region,
    Subregion: data.subregion || "does not exist",
    Capital: data.capital?.[0] || "does not exist",
    TopLevelDomain: data.tld?.[0] || "does not exist",
    Currencies: currenciesObj?.name || "does not exist",
    LanguagesObj: data.languages || "does not exist",
    BordersArr: data.borders || "does not exist",
  };
  return newData;
}

export default function App() {
  const [fromNum, setFromNum] = useState(1);
  const toNum = fromNum + 7;

  const FilteredCountries = [...restrictingCountriesData].filter(
    (_, i) => i >= fromNum - 1 && i <= toNum - 1
  );

  const displayFromNum = fromNum < 1 ? 1 : fromNum;
  const displayToNum =
    toNum > restrictingCountriesData.length
      ? restrictingCountriesData.length
      : toNum;

  const [query, setQuery] = useState("");
  const [regionsSelected, setRegionsSelected] = useState(SortedDataOfRegions);
  const [isCloseDetail, setIsCloseDetail] = useState(true);
  const [eventCurrentTargetId, setEventCurrentTargetId] = useState("");

  const countryFilterData = query
    ? restrictingCountriesData.filter(
        (countryData) =>
          countryData.Name.toLowerCase().includes(query.toLowerCase().trim()) &&
          regionsSelected.includes(countryData.Region)
      )
    : FilteredCountries.filter((countryData) =>
        regionsSelected.includes(countryData.Region)
      );

  const [countryDataObj, setCountryDataObj] = useState(null);

  function handleSelectRegion(e, region) {
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
      setCountryDataObj(null);
    }
  }

  useEffect(() => {
    setIsCloseDetail(isCloseDetail);
  }, [isCloseDetail]);

  useEffect(() => {
    setEventCurrentTargetId(eventCurrentTargetId);
  }, [eventCurrentTargetId]);

  function handleSelectBorder(border) {
    async function GetBorderCountry() {
      const res = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
      const [data] = await res.json();

      const newData = getNewData(data);

      setCountryDataObj(newData);
    }
    GetBorderCountry();
  }
  useEffect(() => {
    setCountryDataObj(countryDataObj);
  }, [countryDataObj]);

  function handlePreListCountries() {
    if (fromNum === 1) return;
    setFromNum((fromNum) => fromNum - 8);
  }

  function handleNextListCountries(arr) {
    if (toNum >= arr.length) return;
    setFromNum((fromNum) => fromNum + 8);
  }

  return (
    <div className="app">
      <Header>
        <ThemeMode />
      </Header>
      {isCloseDetail ? (
        <Homepage>
          <Search query={query} setQuery={setQuery} />
          <CountryListChanger
            displayFromNum={displayFromNum}
            displayToNum={displayToNum}
            onPreListCountries={handlePreListCountries}
            onNextListCountries={handleNextListCountries}
            arr={restrictingCountriesData}
          />
          <FilterMenu onSelectRegion={handleSelectRegion} />
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
          <CountryDetailCard
            eventCurrentTargetId={eventCurrentTargetId}
            onSelectBorder={handleSelectBorder}
            countryDataObj={countryDataObj}
          />
        </DetailPage>
      )}
    </div>
  );
}

function CountryListChanger({
  displayFromNum,
  displayToNum,
  onPreListCountries,
  onNextListCountries,
  arr,
}) {
  return (
    <div className="Country-List-Changer">
      <button onClick={onPreListCountries}>Pre</button>
      <span>From {displayFromNum}</span>
      <span>to {displayToNum}</span>
      <button onClick={() => onNextListCountries(arr)}>Next</button>
    </div>
  );
}

function CountryDetailCard({
  eventCurrentTargetId,
  onSelectBorder,
  countryDataObj,
}) {
  const [countryDetailFilterData] = restrictingCountriesData.filter(
    (countryDetailsData) =>
      countryDetailsData.Name.toLowerCase() ===
      eventCurrentTargetId.toLowerCase()
  );
  const countryData = countryDataObj || countryDetailFilterData;

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
            Top Level Domain:<span> {countryData.TopLevelDomain} </span>
          </p>
          <p>
            Currencies:<span> {countryData.Currencies}</span>
          </p>
          <p>
            Languages:
            {countryData.LanguagesObj &&
            typeof countryData.LanguagesObj === "object" ? (
              Object.values(countryData.LanguagesObj).map(
                (language, index, arr) => (
                  <span key={language}>
                    {" " + language}
                    {index < arr.length - 1 ? "," : "."}
                  </span>
                )
              )
            ) : (
              <span> There is no language</span>
            )}
          </p>
        </div>
        <div className="border-countries">
          <h4 className="title-border-countries">Border Countries:</h4>
          <ul className="box-border-countries">
            {countryData.BordersArr &&
            typeof countryData.BordersArr === "object" ? (
              countryData.BordersArr.map((border) => (
                <li key={border} onClick={() => onSelectBorder(border)}>
                  <button>{border}</button>
                </li>
              ))
            ) : (
              <span>There are no borders.</span>
            )}
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

function Search({ query, setQuery }) {
  return (
    <div className="box-input">
      <span className="fas fa-search"></span>
      <input
        name="search-input"
        type="text"
        className="search-input"
        placeholder="Search for a country..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

function FilterMenu({ onSelectRegion }) {
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
          SortedDataOfRegions.map((region) => onSelectRegion(e, region))
        }
      >
        {/* //// ! این مورد کی رو بعدا درست کنم */}
        {SortedDataOfRegions.map((region, index) => (
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
