const inquirer = require('inquirer');
require('colors');

const preguntas = [
	{
		type: 'list',
		name: 'opcion',
		message: '¿Qué desea hacer?',
		choices: [
			{
				value: 1,
				name: `${'1.'.green} Buscar ciudad`
			},
			{
				value: 2,
				name: `${'2.'.green} Historial`
			},
			{
				value: 0,
				name: `${'0.'.green} Salir`
			}
		]
	}
];

const entrada = [
	{
		type: 'input',
		name: 'pausa',
		message: `Presione ${ 'ENTER'.green } para continuar`
	}
];

const inquirerMenu = async() =>{
	console.clear();
	console.log('====================='.green);
	console.log('Seleccione una opción'.green);
	console.log('=====================\n'.green);

	const {opcion} = await inquirer.prompt(preguntas);

	return opcion;
}

const Pausa = async() =>{
	const opcion = await inquirer.prompt(entrada);
}

const leerInput = async(message) =>{
	const entrada = [
		{
			type: 'input',
			name: 'desc',
			message,
			validate(value) {
				if (value.length == 0) {
					return 'Por favor ingrese un valor';
				}
				return true;
			}
		}
	];

	const {desc} = await inquirer.prompt(entrada);
	return desc;
}

const listarLugares = async( lugares = []) =>{
		const choices = lugares.map( (lugar, i) =>{
				const idx = `${i + 1}.`.green;
				return{
					value : lugar.id,
					name: `${idx} ${lugar.nombre}`
				}
			}
		);

		choices.unshift({
				value:'0',
				name: '0.'.green + ' Cancelar'
			}
		);

		const preguntas = [
			{
				type: 'list',
				name: 'id',
				message: 'Seleccione lugar:', 
				choices
			}
		]

		const {id} = await inquirer.prompt(preguntas);
		return id;
}

const confirmar = async(message) => {
	const pregunta = [
		{
			type: 'confirm',
			name: 'ok',
			message
		}
	];
	const {ok} = await inquirer.prompt(pregunta);
	return ok;
}

const checkList = async( tareas = []) =>{
		const choices = tareas.map( (tarea, i) =>{
				const idx = `${i + 1}.`.green;
				return{
					value : tarea.id,
					name: `${idx} ${tarea.desc}`,
					checked: (tarea.completadoEn) ? true : false
				}
			}
		);

		const preguntas = [
			{
				type: 'checkbox',
				name: 'ids',
				message: 'Selecciones', 
				choices
			}
		]

		const {ids} = await inquirer.prompt(preguntas);
		return ids;
}

module.exports = { 
	inquirerMenu, 
	Pausa, 
	leerInput, 
	listarLugares,
	confirmar, 
	checkList
}