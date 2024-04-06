import AppRoutes from './router/Router';
import Header from './component/Header';
import './assets/style/App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <AppRoutes />
    </div>
  );
}

export default App;