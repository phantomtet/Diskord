import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { SignIn } from './routes/signin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path='/signin' component={SignIn}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
