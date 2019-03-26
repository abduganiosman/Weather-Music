// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style3';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import	Btn from '../btns';
import btn_style from '../btns/btn';
//Import the data for dynamic changw with weather
import data from '../data';
//Import the progress component
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default class Iphone3 extends Component {
	// a constructor with initial set states
	constructor(props){
		super(props);

		this.state = {
      latitude: null,
      longitude: null,
      error: null,
    };
	}

	componentDidMount() {
		//get the location of the current position using the react location component
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
					//Set the state of the long and lar which was stated in the constructor
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
		//When the DOM first loads run the function location
		this.fetchWeatherData1('london');
  }

	// a call to fetch weather data via openweathermap which takes the city as an argument
	fetchWeatherData1 = (city) =>{
		var url = 'http://api.openweathermap.org/data/2.5/weather?q='+city+',Uk&units=metric&APPID=7c1a77905a9efb1d76132cbf52a77f7a';
		this.setState({ loading: false });
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
	}

	// a call to fetch weather data via openweathermap which takes the long and lat of your current geo location
	fetchWeatherData2 = (lat , long) =>{
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		//API - 'http://api.openweathermap.org/data/2.5/weather?q=new york,Us&units=metric&APPID=7c1a77905a9efb1d76132cbf52a77f7a';
		var url = 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&units=metric&APPID=7c1a77905a9efb1d76132cbf52a77f7a';
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
	}

	// the main render method for the iphone component
	render() {

		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		//VAriables for the westher
		var london = 'london';
		var birm = 'birmingham';
		var man = 'manchester';
		//Percentage used to display chance of Rain
		var percentage = Number(this.state.chancerain)*10;
		percentage = percentage.toFixed(0);

		return (

			<div class={ style.container } style ={ { backgroundImage: "url("+this.state.bimage+")" } }>

				{/* // header */}
				<div class={ style.header }>
					<div class={style.gridcontainer }>
						{/* In the header there are 3 tabs whcich are buttons from btn component */}
						{/* When clicked they print the weather to the content div */}
						<Btn  class = {btn_style.griditem} clickFunction = {() => this.fetchWeatherData2(this.state.latitude,this.state.longitude)} location='Current Location'/>
						<Btn  class = {btn_style.griditem} clickFunction = {() => this.fetchWeatherData1(birm)} location= 'Birmingham'/>
						<Btn  class = {btn_style.griditem} clickFunction = {() => this.fetchWeatherData1(man)} location= 'Manchester'/>
					</div>
				</div>
				{/*	end header */}

				{/* Content Page */}
				<div class={style.content}>
					<img class={style.image} src={this.state.icon} alt={this.state.failicon}/>
					<p class={ style.conditions }>{ this.state.cond }</p>
					<p class={ style.city }>{ this.state.locate }</p>
					<p class={ tempStyles }>{ this.state.temp }&#8451;</p>
					<p class={ style.temprange }>Min:{this.state.mintemp} | Max:{this.state.maxtemp}</p>
				</div>
				{/* END CONTENT */}

				{/* info content*/}
					<div class={style.gridcontainer1}>

						<div class={style.griditem2}>
							<img class={style.image} src={this.state.windicon}/>
							<p class={ style.wind_speed }>
							{ this.state.wind_speed }</p>
						</div>

  					<div class={style.griditem2} style={{ width: '80px'}}>
							{/*circular component imported*/}
							<CircularProgressbar
									percentage={percentage}
									text={'Rain:'+ percentage+'%'}
									initialAnimation
									styles={{
										text: { fill: 'white',fontSize: '15px',},
										trail:{stroke: '#dfe6e9',},}}/>
						</div>

					</div>


					{/*Music player */}
					<div class={style.musicplayer}>
						<iframe src={this.state.URLl} ></iframe>
					</div>
					{/* end musicplayer */}

			</div>
		);
	}

	parseResponse = (parsed_json) => {
		//Variable used to hold the data from the API JSON file
		var location = parsed_json['name'];
		var temp_c = parsed_json['main']['temp'];
		var conditions = parsed_json['weather']['0']['description'];
		var windspeed = " " + parsed_json['wind']['speed'];
		var iconcode = parsed_json['weather']['0']['icon'];
		//var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
		var chanceofrain;
		//If the weather condtion is not rai then set the chance of rain to 0 due to API
		//Not provinding information of chance of rain if conditions is not rain
		if(conditions.includes('rain')){
			chanceofrain 	= parsed_json['rain']['1h'];
		}else{
			chanceofrain = 0;
		}
		var iconurl;
		var altweather = "image failed";
		var url = "";
		var backimg;
		var windspeedicon = "../assets/icons/wind.png";
		var maxx = parsed_json['main']['temp_max'].toFixed(0);
		var minn = parsed_json['main']['temp_min'].toFixed(0);

		//run a for loop on the data.js file and
		//dynamically change the interface when the API weather function is called

		for (const info of data){
			if(conditions.includes(info.type)){
				url = info.music
				backimg = info.image
				iconurl = info.icon
			}
		}

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c.toFixed(0),
			cond : conditions,
			wind_speed :windspeed,
			windicon: windspeedicon,
			icon : iconurl,
			failicon : iconurl,
			URLl: url,
			bimage: backimg,
			maxtemp : maxx,
			mintemp: minn,
			chancerain: chanceofrain,

		});
	}
}
