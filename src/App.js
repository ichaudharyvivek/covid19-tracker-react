import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState('');
  const [tableData, setTableData] = useState([]);

  // Get the list of all countries
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then(data => {
          const countries = data.map((country) => ({
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))
          setTableData(data)
          setCountries(countries)
        })
    }    
  }, [])

  // Load Default for worldwide cases
  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(res=>res.json())
    .then(data=>{setCountryInfo(data)})
  },[])

  // Handle when country is changing via dropdown
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log(countryCode);  
    const url = countryCode === 'worldwide' ?
      'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(res=>res.json())
    .then(data=>{
        setCountry(countryCode);
        setCountryInfo(data);
    })    
  }
  // Log ContryInfo to see json
  console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" total={countryInfo.cases} cases={countryInfo.todayCases} />
          <InfoBox title="Recovered" total={countryInfo.recovered} cases={countryInfo.todayRecovered} />
          <InfoBox title="Deaths" total={countryInfo.deaths} cases={countryInfo.todayDeaths} />
        </div>

        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>          
          <h3>Worldwide new cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
