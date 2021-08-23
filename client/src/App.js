import { Provider } from "react-redux";
import store from "./reducers/store";

import {
  Router,
  Route,
  Switch,
} from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";

import SignUp from "./components/SignUp";
import SocialSignUp from "./components/SocialSignUp";
import ChoosePlan from "./components/ChoosePlan";
import MealPlan from "./components/MealPlan";
import PaymentDetails from "./components/PaymentDetails";
import Profile from "./components/Profile";
import SelectMeal from "./components/SelectMeal";
import Congratulations from "./components/Congratulations";
import About from "./components/About";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import EditPlan from "./components/EditPlan";
import Terms from "./components/Terms";
import UpdatePlan from "./components/UpdatePlan";
import ForgotPassword from "./components/RecoverPassword";
import "./App.css";

import { createBrowserHistory } from "history";
import Login from "./components/Login"

import AdminNavBar from './components/Admin/AdminNavBar'
import AdminHome from './components/Admin/Home';
import AdminCreateMenu from './components/Admin/CreateMenu';
import AdminEditMeal from './components/Admin/EditMeal';
import AdminCreateMeal from './components/Admin/CreateMeal';
import AdminEditMealRecipe from './components/Admin/EditMealRecipe';
import AdminPlansCoupons from './components/Admin/PlansCoupons';
import AdminOrderIngredients from './components/Admin/OrdersIngredients';
import AdminCustomers from './components/Admin/Customers';
import AdminGoogleAnalytics from './components/Admin/GoogleAnalytics';
import AdminNotfications from './components/Admin/Notifications';
import AdminZones from './components/Admin/Zones';
import AdminCustomerInfo from './components/Admin/CustomerInfo';
import AdminIngredientsUnits from './components/Admin/IngredientsUnits';

import Landing from './components/ServingNow/Landing';
import LoginPage from './components/ServingNow/Login';
import RegisterPage from './components/ServingNow/Register';
import CreatePassword from './components/ServingNow/CreatePassword';
import Confirmation from './components/ServingNow/Confirmation';
import ClientForm from './components/ServingNow/ClientForm';
import PickItems from './components/ServingNow/PickItems';
import Cart from './components/ServingNow/Cart';


// import MapTest from './components/MapTest';
import Congrats from "./components/Congrats";

export const history = createBrowserHistory();

function App() {

  /*kk
  const [auth, setAuth] = React.useState(false);
  const readCookie = () => {
    const customer = Cookies.get("customer_uid");
    // console.log(customer);
    if (customer) {
      setAuth(true);
    }
  };

  React.useEffect(() => {
    readCookie();
  }, []);
  */

  const adminNavBar = <AdminNavBar />;

  return (
    <div className="root">
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <AppliedRoute exact path="/home" component={Home} />
            <AppliedRoute exact path="/about" component={About} />
            <AppliedRoute exact path="/" component={Home} />
            <AppliedRoute exact path="/sign-up" component={SignUp} />
            <AppliedRoute
              exact
              path="/social-sign-up"
              component={SocialSignUp}
            />
            <AppliedRoute exact path="/choose-plan" component={ChoosePlan} />
            <AppliedRoute
              exact
              path="/subscription-history"
              component={MealPlan}
            />
            <AppliedRoute exact path="/meal-plan" component={EditPlan} />
            <AppliedRoute
              exact
              path="/terms-and-conditions"
              component={Terms}
            />
            <AppliedRoute
              exact
              path="/payment-details"
              component={PaymentDetails}
            />
            <AppliedRoute exact path="/profile" component={Profile} />
            <AppliedRoute exact path="/select-meal" component={SelectMeal} />
            <AppliedRoute
              exact
              path="/congratulations"
              component={Congratulations}
            />
            <AppliedRoute exact path="/login" component={Login} />
            <AppliedRoute
              exact
              path="/forgot-password"
              component={ForgotPassword}
            />
            <AppliedRoute exact path="/congrats" component={Congrats} />
            {/*<AppliedRoute exact path='/edit-plan' component={EditPlan} />*/}
            <AppliedRoute exact path="/update-plan" component={UpdatePlan} />

            {/* <AppliedRoute exact path='/test' component={MapTest} /> */}

            <Route exact path="/admin">
              <AdminHome />
            </Route>
            <Route exact path="/admin/create-menu">
              <AdminCreateMenu />
            </Route>
            <Route exact path="/admin/edit-meal">
              <AdminEditMeal />
            </Route>
            <Route exact path="/admin/create-meal">
              <AdminCreateMeal />
            </Route>
            <Route exact path="/admin/edit-meal-recipe">
              <AdminEditMealRecipe />
            </Route>
            <Route exact path="/admin/plans-coupons">
              <AdminPlansCoupons />
            </Route>
            <Route exact path="/admin/order-ingredients">
              <AdminOrderIngredients />
            </Route>
            <Route exact path="/admin/google-analytics">
              <AdminGoogleAnalytics />
            </Route>
            <Route exact path="/admin/notifications">
              <AdminNotfications />
            </Route>
            <Route exact path="/admin/zones">
              <AdminZones />
            </Route>
            <Route exact path="/admin/customers">
              <AdminCustomerInfo />
            </Route>
            <Route exact path="/admin/ingredients-units">
              <AdminIngredientsUnits />
            </Route>
            
            <Route exact path="/landing">
              <Landing/>
            </Route>
            <Route exact path="/loginfth">
              <LoginPage/>
            </Route>
            <Route exact path="/register">
              <RegisterPage/>
            </Route>
            <Route exact path="/createpassword">
              <CreatePassword/>
            </Route>
            <Route exact path="/confirmation">
              <Confirmation/>
            </Route>
            <Route exact path="/clientform">
              <ClientForm/>
            </Route>
            <Route exact path="/pickitems">
              <PickItems/>
            </Route>
            <Route exact path="/cart">
              <Cart/>
            </Route>
            
            <AppliedRoute path='*' component={NotFound} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
