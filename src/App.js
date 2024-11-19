import { useState } from "react";

const tempData = [
  {
    cca3: "FRA",
    flags: { svg: "https://flagcdn.com/fr.svg" },
    name: { common: "France", nativeName: { fra: { common: "France" } } },
    population: 67391582,
    region: "Europe",
    subregion: "Western Europe",
    capital: ["Paris"],
    tld: [".fr"],
    currencies: { EUR: { name: "Euro" } },
    languages: {
      fra: "French",
    },
    borders: ["AND", "BEL", "DEU", "ITA", "LUX", "MCO", "ESP", "CHE"],
  },
  {
    cca3: "BRA",
    flags: { svg: "https://flagcdn.com/br.svg" },
    name: { common: "Brazil", nativeName: { fra: { common: "Brasil" } } },
    population: 212559409,
    region: "Americas",
    subregion: "South America",
    capital: ["Brasília"],
    tld: [".br"],
    currencies: { BRL: { name: "Euro" } },
    languages: {
      por: "Portuguese",
    },
    borders: [
      "ARG",
      "BOL",
      "COL",
      "GUF",
      "GUY",
      "PRY",
      "PER",
      "SUR",
      "URY",
      "VEN",
    ],
  },
];

function getNewData(data, i) {
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
    cca3: data.cca3,
    num: i + 1,
    flag: data.flags.svg,
    name: data.name.common,
    nativeName: nativeNameObj?.common || "does not exist",
    population: data.population,
    region: data.region,
    subregion: data.subregion || "does not exist",
    capital: data.capital?.[0] || "does not exist",
    topLevelDomain: data.tld?.[0] || "does not exist",
    currencies: currenciesObj?.name || "does not exist",
    LanguagesObj: data.languages || "does not exist",
    BordersArr: data.borders || "does not exist",
  };
  return newData;
}

async function getAllCountries() {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/all`);
    const allCountries = await res.json();

    if (!res.ok) throw new Error("There is a problem!");
    return { data: allCountries };
  } catch (err) {
    return { data: tempData, error: err.message };
  }
}
const countriesData = await getAllCountries();

const allCountriesReceived = countriesData.data;

const allCountriesSorted = [...allCountriesReceived].sort((a, b) => {
  // ignore upper and lowercase
  const NameA = a.name.common.toLowerCase();
  const NameB = b.name.common.toLowerCase();

  if (NameA < NameB) return -1;
  if (NameA > NameB) return 1;
  return 0;
});

const restrictingCountriesData = allCountriesSorted.map((el, i) =>
  getNewData(el, i)
);

const regionsData = restrictingCountriesData.map((country) => country.region);

const uniqueDataOfRegions = [...new Set(regionsData)];

const sortedDataOfRegions = [...uniqueDataOfRegions].sort((a, b) => {
  // ignore upper and lowercase
  const RegionA = a.toLowerCase();
  const RegionB = b.toLowerCase();

  if (RegionA < RegionB) return -1;
  if (RegionA > RegionB) return 1;
  return 0;
});

export default function App() {
  const [query, setQuery] = useState("");

  const [fromNum, setFromNum] = useState(1);
  const toNum = fromNum + 7;
  const displayFromNum = fromNum < 1 ? 1 : fromNum;
  const displayToNum =
    toNum > restrictingCountriesData.length
      ? restrictingCountriesData.length
      : toNum;

  const [isCloseMenu, setIsCloseMenu] = useState(true);
  const [regionsSelected, setRegionsSelected] = useState([
    ...sortedDataOfRegions,
  ]);

  const [isCloseDetail, setIsCloseDetail] = useState(true);
  const [eventCurrentTargetId, setEventCurrentTargetId] = useState("");

  const FilterCountries = [...restrictingCountriesData].filter(
    (_, i) => i >= fromNum - 1 && i <= toNum - 1
  );

  const countryFilterData = query
    ? restrictingCountriesData.filter(
        (countryData) =>
          countryData.name.toLowerCase().includes(query.toLowerCase().trim()) &&
          regionsSelected.includes(countryData.region)
      )
    : FilterCountries.filter((countryData) =>
        regionsSelected.includes(countryData.region)
      );

  const [countryDataObj, setCountryDataObj] = useState(null);

  function handlePreListCountries() {
    fromNum !== 1 && setFromNum((fromNum) => fromNum - 8);
  }

  function handleNextListCountries(arr) {
    toNum < arr.length && setFromNum((fromNum) => fromNum + 8);
  }

  function handleToggleFilterMenu(e) {
    e.target.classList.contains("Menu-toggle-control") &&
      setIsCloseMenu((isCloseMenu) => !isCloseMenu);

    !e.target.classList.contains("Menu-close-control") &&
      !isCloseMenu &&
      setIsCloseMenu(true);
  }

  function handleSelectRegion(e, region) {
    if (!e.target.classList.contains(region)) return;

    e.target.classList.contains("selected")
      ? setRegionsSelected((regionsSelected) =>
          regionsSelected.filter((reg) => reg !== region)
        )
      : setRegionsSelected((regionsSelected) =>
          [...regionsSelected, region].sort()
        );
  }

  function handleOpenDetailPage(e) {
    setIsCloseDetail(false);
    setEventCurrentTargetId(e.currentTarget.id);
    setCountryDataObj(null);
  }

  function handleCloseDetailPage() {
    setIsCloseDetail(true);
    setQuery("");
  }

  function handleSelectBorder(border) {
    const [newData] = restrictingCountriesData.filter(
      (el) => el.cca3 === border
    );
    setCountryDataObj(newData);
  }

  return (
    <div className="app" onClick={handleToggleFilterMenu}>
      <Header>
        <ThemeMode />
      </Header>
      {isCloseDetail ? (
        <Homepage>
          {countriesData.error && <Error />}
          <Search query={query} setQuery={setQuery} />
          <CountryListChanger
            displayFromNum={displayFromNum}
            displayToNum={displayToNum}
            onPreListCountries={handlePreListCountries}
            onNextListCountries={handleNextListCountries}
          />
          <FilterMenu
            onSelectRegion={handleSelectRegion}
            isCloseMenu={isCloseMenu}
            regionsSelected={regionsSelected}
          />
          {countryFilterData.map((countryData) => (
            <CountryCard
              countryData={countryData}
              key={countryData.name}
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

function Error() {
  return (
    <div className="errorText">
      <p>{countriesData.error}:</p>
      <p>
        The following data does not belong to the server and is rendered only to
        demonstrate the functionality of the app...
      </p>
    </div>
  );
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

function CountryListChanger({
  displayFromNum,
  displayToNum,
  onPreListCountries,
  onNextListCountries,
}) {
  return (
    <div className="Country-List-Changer">
      <button onClick={onPreListCountries}>Pre</button>
      <span>
        <p>From</p>
        <p>{displayFromNum}</p>
      </span>
      <span>
        <p>to</p>
        <p>{displayToNum}</p>
      </span>
      <button onClick={() => onNextListCountries(restrictingCountriesData)}>
        Next
      </button>
    </div>
  );
}

function FilterMenu({ onSelectRegion, isCloseMenu, regionsSelected }) {
  const numOfFilteredRegions = Math.abs(
    regionsSelected.length - uniqueDataOfRegions.length
  );
  return (
    <div className="box-menu">
      <nav className="menu">
        <p className="box-title-menu Menu-toggle-control">
          Filter by Region
          <span
            className={`fas fa-angle-down Menu-toggle-control ${
              isCloseMenu ? "active" : ""
            }`}
          ></span>
          <span
            className={`fas fa-angle-up Menu-toggle-control ${
              !isCloseMenu ? "active" : ""
            }`}
          ></span>
        </p>
        <ul
          className={`list-region Menu-close-control ${
            isCloseMenu ? "hidden" : ""
          }`}
          onClick={(e) =>
            sortedDataOfRegions.map((region) => onSelectRegion(e, region))
          }
        >
          {sortedDataOfRegions.map((region) => (
            <li
              key={region}
              className={`${region} ${
                regionsSelected.includes(region) ? "selected" : ""
              } Menu-close-control`}
            >
              {region}
            </li>
          ))}
        </ul>
      </nav>
      <div className="box-explanation-filter-menu">
        <p className="explanation-filter-menu">
          <span>{numOfFilteredRegions || "No"} </span>
          {numOfFilteredRegions === 1
            ? "region is filtered"
            : "regions are filtered"}
        </p>
      </div>
    </div>
  );
}

function CountryCard({ countryData, onOpenDetailPage }) {
  return (
    <div
      id={countryData.name.replaceAll(" ", "-")}
      className="country-card"
      key={countryData.name.replaceAll(" ", "-")}
      onClick={(e) => onOpenDetailPage(e)}
    >
      <FirstPartOfCountryCard countryData={countryData} />
    </div>
  );
}

function FirstPartOfCountryCard({ countryData, children }) {
  return (
    <>
      <div className="box-img">
        <img src={countryData.flag} alt={`${countryData.name} country flag`} />
      </div>
      <section className="card-body-primary">
        <span className="country-num">{countryData.num}</span>
        <h3>{countryData.name}</h3>
        {children}
        <PrimaryInfoCountryCard countryData={countryData} />
      </section>
    </>
  );
}

function PrimaryInfoCountryCard({ countryData }) {
  return (
    <>
      <p>
        Population:
        <span> {Intl.NumberFormat().format(countryData.population)}</span>
      </p>
      <p>
        Region:<span> {countryData.region}</span>
      </p>
      <p>
        Capital:<span> {countryData.capital}</span>
      </p>
    </>
  );
}

function DetailPage({ children }) {
  return <main className="Detail-Page">{children}</main>;
}

function BackButton({ onCloseDetailPage }) {
  return (
    <button className="BackButton" onClick={onCloseDetailPage}>
      <span className="fas fa-angle-left"></span>Back
    </button>
  );
}

function CountryDetailCard({
  eventCurrentTargetId,
  onSelectBorder,
  countryDataObj,
}) {
  const [countryDetailFilterData] = restrictingCountriesData.filter(
    (countryDetailsData) =>
      countryDetailsData.name.replaceAll(" ", "-").toLowerCase() ===
      eventCurrentTargetId.toLowerCase()
  );
  const countryData = countryDataObj || countryDetailFilterData;

  return (
    <div
      className="country-card country-detail-card"
      key={countryData.name.replaceAll(" ", "-")}
    >
      <FirstPartOfCountryCard countryData={countryData}>
        <p className="first-phrase">
          Native Name:<span> {countryData.nativeName}</span>
        </p>
        <p className="last-phrase">
          Sub Region:<span> {countryData.subregion}</span>
        </p>
      </FirstPartOfCountryCard>

      <section className="card-body-secondary">
        <div className="more-information">
          <p>
            Top Level Domain:<span> {countryData.topLevelDomain} </span>
          </p>
          <p>
            Currencies:<span> {countryData.currencies}</span>
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
