import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "./src/screen/Home";
import AddCategory from "./src/screen/AddCategory";
import NewExpense from "./src/screen/NewExpense";
import ExpenseHistory from "./src/screen/ExpenseHistory";

const AppRoute = createStackNavigator(
  {
    HomeScreen: Home,
    AddCategoryScreen: AddCategory,
    NewExpenseScreen: NewExpense,
    ExpenseHistoryScreen: ExpenseHistory
  },
  {
    headerMode: "none"
  }
)

const AppContainer = createAppContainer(AppRoute)

export default AppContainer