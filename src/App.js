import './App.css';
import Home from './Home'
import Header from './Header'
import SearchPage from './SearchPage'
import Footer from './Footer'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


function App() {
  return (

    //BEM
    <div className="app">
    <Router>
      <Header />

      <Switch>
        <Route path="/search">
      <SearchPage />
      </Route>
      <Route path="/">

          <Home />
      </Route>

      </Switch>
      
      <Footer />
        {/* Home */}

              {/* Header */}

              {/* Banner */}
                {/* Search */}

              {/* Cards */}
              {/* Footer */}
        {/* SearchPage */}
           {/* Header */}
           {/*.... */}
           </ Router>
    </div>
  );
}

export default App;
