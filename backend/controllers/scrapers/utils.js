const fs = require("fs");

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const usStates = [
  "Alaska",
  "Alabama",
  "Arkansas",
  "American Samoa",
  "Arizona",
  "California",
  "Colorado",
  "Connecticut",
  "District of Columbia",
  "Delaware",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Iowa",
  "Idaho",
  "Illinois",
  "Indiana",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Massachusetts",
  "Maryland",
  "Maine",
  "Michigan",
  "Minnesota",
  "Missouri",
  "Mississippi",
  "Montana",
  "North Carolina",
  "North Dakota",
  "Nebraska",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "Nevada",
  "New York",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Virginia",
  "Virgin Islands",
  "Vermont",
  "Washington",
  "Wisconsin",
  "West Virginia",
  "Wyoming",
];

var countries = [];
data = fs.readFileSync("locations.txt", "utf8");
data = data.replace(/["']/g, "");
countries = data.split(",");

const countriesList = [
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cameroon",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Democratic Republic of the Congo",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Ethiopia",
  "Gabon",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Ivory Coast",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Republic of the Congo",
  "Réunion",
  "Rwanda",
  "São Tomé and Príncipe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
  "Antarctica",
  "French Southern and Antarctic Lands",
  "Afghanistan",
  "Azerbaijan",
  "Bangladesh",
  "Bhutan",
  "Brunei",
  "Cambodia",
  "China",
  "East Timor",
  "Hong Kong",
  "India",
  "Indonesia",
  "Japan",
  "Kazakhstan",
  "Kyrgyzstan",
  "Laos",
  "Macau",
  "Malaysia",
  "Maldives",
  "Mongolia",
  "Myanmar (Burma)",
  "Nepal",
  "North Korea",
  "Pakistan",
  "Philippines",
  "Singapore",
  "South Korea",
  "Sri Lanka",
  "Taiwan",
  "Tajikistan",
  "Thailand",
  "Tibet",
  "Turkmenistan",
  "Uzbekistan",
  "Vietnam",
  "Antigua and Barbuda",
  "Aruba",
  "Bahamas",
  "Barbados",
  "Bermuda",
  "British Virgin Islands",
  "Cayman Islands",
  "Cuba",
  "Curaçao",
  "Dominica",
  "Dominican Republic",
  "Grenada",
  "Guadeloupe",
  "Haiti",
  "Jamaica",
  "Martinique",
  "Montserrat",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Trinidad and Tobago",
  "Turks and Caicos Islands",
  "Belize",
  "Costa Rica",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "Nicaragua",
  "Panama",
  "Albania",
  "Andorra",
  "Armenia",
  "Austria",
  "Belarus",
  "Belgium",
  "Bosnia and Herzegovina",
  "Bulgaria",
  "Crimea",
  "Croatia",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Estonia",
  "Faroe Islands",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Greenland",
  "Guernsey",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Jersey",
  "Kosovo",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Moldova",
  "Monaco",
  "Montenegro",
  "Netherlands",
  "North Macedonia",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "San Marino",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Ukraine",
  "United Kingdom",
  "Vatican City",
  "Bahrain",
  "Golan",
  "Iran",
  "Iraq",
  "Israel",
  "Jordan",
  "Kuwait",
  "Lebanon",
  "Oman",
  "Qatar",
  "Saudi Arabia",
  "Syria",
  "Turkey",
  "United Arab Emirates",
  "Yemen",
  "Canada",
  "Mexico",
  "United States",
  "Australia",
  "Fiji",
  "French Polynesia",
  "Marshall Islands",
  "Micronesia",
  "New Caledonia",
  "New Zealand",
  "Palau",
  "Papua New Guinea",
  "Pitcairn Islands",
  "Samoa",
  "Solomon Islands",
  "Tonga",
  "Tuvalu",
  "Vanuatu",
  "Argentina",
  "Bolivia",
  "Brazil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Falkland Islands",
  "Guyana",
  "Paraguay",
  "Peru",
  "Uruguay",
  "Venezuela",
];

module.exports = {
  countries,
  timeout,
  usStates,
};
