import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "./src/screen/Home";
import AddCategory from "./src/screen/AddCategory";
import NewExpense from "./src/screen/NewExpense";

const AppRoute = createStackNavigator(
  {
    HomeScreen: Home,
    AddCategoryScreen: AddCategory,
    NewExpenseScreen: NewExpense
  },
  {
    headerMode: "none"
  }
)

const AppContainer = createAppContainer(AppRoute)

export default AppContainer