import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "./src/screen/Home";
import AddCategory from "./src/screen/AddCategory";

const AppRoute = createStackNavigator(
  {
    HomeScreen: Home,
    AddCategoryScreen: AddCategory
  },
  {
    headerMode: "none"
  }
)

const AppContainer = createAppContainer(AppRoute)

export default AppContainer