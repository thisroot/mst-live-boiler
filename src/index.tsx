import React from 'react';
import ReactDOM from 'react-dom';
import { RouterContainer } from 'containers/Router';
import * as serviceWorker from 'utils/serviceWorker/serviceWorker';


const container = document.getElementById("root")
ReactDOM.render(<RouterContainer />, container);

// позволяет выполнить функцию жизненного цикла componentWillUnmount при закрытии приложения.
// в нашем случае она скидывает дамп редак стора в локальное хранилище
window.addEventListener("beforeunload", () => {
    ReactDOM.unmountComponentAtNode(container)
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
