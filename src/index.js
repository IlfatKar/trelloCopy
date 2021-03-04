import './main.css'
import 'regenerator-runtime/runtime'
import {App} from './classes'
import {Toast} from './utils/toast'


new App('.workplace').use(new Toast({bgColor: '#9b4dca', border: '1px solid black'}))