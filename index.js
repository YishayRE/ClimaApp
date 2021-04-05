require('dotenv').config()

const{
	inquirerMenu,
	Pausa,
	leerInput,
	listarLugares
} = require("./Helpers/inquirer");
const Busquedas = require('./Models/busquedas');

const main = async() =>{
	let opt;
	const busquedas = new Busquedas();

	do{
		//console.clear();
		opt = await inquirerMenu();
		//busquedas.ciudad('Mexico');

		switch(opt){
			case 1:
				const lugar = await leerInput('Ciudad: ');
				const lugares = await busquedas.ciudad( lugar );
				const id = await listarLugares(lugares);
				
				if(id === '0')
					continue;

				const lugarSel = lugares.find( l => l.id = id);

				busquedas.agregarHistorial(lugarSel.nombre);

				const clima = await busquedas.Clima(lugarSel.lat, lugarSel.lng);
				//console.log(clima);

				console.clear();
				console.log('\nInformación de la ciudad\n'.green);
				console.log('Ciudad:', lugarSel.nombre);
				console.log('Latitud:', lugarSel.lat);
				console.log('Longitud:', lugarSel.lng);
				console.log('Temperatura:', clima.tem);
				console.log('Mínima:', clima.min);
				console.log('Máxima:', clima.max);
				console.log('Como está el clima:', clima.est);
				break;
			case 2:
				busquedas.historialM().forEach((lugar, i) =>{
						const idx = `${i + 1}.`.green;
						console.log(`${ idx } ${ lugar }`);
					}
				);
				break;
		}

		console.log();

		if(opt !== 0)
			await Pausa();
	}while(opt !== 0);
}

main();
