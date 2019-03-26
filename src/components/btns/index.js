// import preact
import { h, render, Component } from 'preact';
import style from './btn';

export default class Btn extends Component {

	// rendering a function when the button is clicked
	render(props) {

		let cFunction = this.props.clickFunction;
		if(typeof cFunction !== 'function'){
			cFunction = () => {
				console.log("passed something as 'clickFunction' that wasn't a function !");
			}
		}
		return (
			<button class={style.btn} onClick={cFunction}>{props.location}</button>
		);
	}
}
