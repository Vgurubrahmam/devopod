import {BrowserRouter,Route,Routes } from "react-router-dom"
import ProtectedRoute from "./assets/components/protectedRoute"
import SignUpForm from "./assets/components/SignUpForm"
import LoginForm from "./assets/components/LoginForm"
import Home from "./assets/components/usersData"
import AddPost from "./assets/components/addPost"
import UpdateLead from "./assets/components/updatePost"
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route element={<ProtectedRoute/>}>
        <Route path="/home" element={<Home/>}/>
        <Route path="/addpost" element={<AddPost/>}/>
        <Route path="/updatelead/:userId" element={<UpdateLead />} />
        </Route>

      </Routes>
    </>
  )
}
export default App