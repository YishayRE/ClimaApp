const axios = require('axios');
const fs = require('fs');

class Busquedas{
	historial = [];
	dbPath = './DB/database.json';

	constructor(){
		this.leerDB();
	}

	get paramsMapbox(){
		return {
			'access_token': process.env.MAPBOX_KEY,
			'limit': 5,
			'language': 'es'
		}
	}

	get paramsWeather(){
		return {
			'appid': process.env.OPENWEATHER,
			'units': 'metric',
			'lang': 'es'
		}
	}

	historialM(){
		return this.historial.map( lugar =>{
				let palabra = lugar.split(' ');
				palabra = palabra.map( p => p[0].toUpperCase() + p.substring(1));

				return palabra.join(' ');
			}
		);
		//return capitalize(this.historial);
		//return this.historial.toLocaleUpperCase('tr');
	}

	async ciudad( lugar = ''){
		//console.log('Ciudad:', lugar);
		try{
			const instance = axios.create({
					baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
					params: this.paramsMapbox
				}
			);

			const resp = await instance.get();
			return resp.data.features.map( lugar => ({
						id: lugar.id,
						nombre: lugar.place_name,
						lng: lugar.center[0],
						lat: lugar.center[1]
					}
				)
			);
		}
		catch(error){
			console.log('Error al buscar ese lugar');
			return [];
		}
	}

	async Clima( lat, lon ){
		try{
			const instance = axios.create({
					baseURL: `https://api.openweathermap.org/data/2.5/weather`,
					params: { ...this.paramsWeather, lat, lon}
/*//mi manera
					{
						'lat': lat,
						'lon': lon,
						'appid': process.env.OPENWEATHER,
						'units': 'metric',
						'lang': 'es'
					}
*/
				}
			);

			const resp = await instance.get();
			const {weather, main} = resp.data;

			return {
				tem: main.temp,
				min: main.temp_min,
				max: main.temp_max,
				est: weather[0].description
			};
/*//Mi manera
			return {
				tem: resp.data.main.temp,
				min: resp.data.main.temp_min,
				max: resp.data.main.temp_max,
				est: resp.data.weather[0].description
			};
*/
			//return resp.data.weather[0].description;
			/*
			return {
				tem: '',
				min: '',
				max: '',
				est: ''
			}
			*/
		}
		catch(error){
			console.log(error);
			return [];
		}
	}

	agregarHistorial( lugar = ''){
		if(this.historial.includes(lugar.toLocaleLowerCase())){
			return;
		}
		this.historial = this.historial.splice(0,5);
		this.historial.unshift(lugar.toLocaleLowerCase());
		this.guardarDB();
	}

	guardarDB(){
		const payload = {
			historial: this.historial
		};
		fs.writeFileSync(this.dbPath, JSON.stringify(payload));
	}

	leerDB(){
		if(!fs.existsSync(this.dbPath)){
			return null;
		}
		const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
		const data = JSON.parse(info);
		//console.log(data.historial);//prueba
		this.historial = data.historial;
	}
}

module.exports = Busquedas;