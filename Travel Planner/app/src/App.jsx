import { useState } from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
import Destinations from './components/Destinations/Destinations'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Flights from './components/Flights/Flights'
import NotFound from './components/NotFound/NotFound'
import TripPlanner from './components/TripPlanner/TripPlanner'
import Trips from './components/Trips/Trips'
import Profile from './components/Profile/Profile'
import Dashboard from './components/Dashboard/Dashboard'
import SavedFlights from './components/SavedFlights/SavedFlights'
import PastTrips from './components/PastTrips/PastTrips'
import TripsWorkspace from './components/TripsWorkspace/TripsWorkspace'
import PlannerWorkspace from './components/PlannerWorkspace/PlannerWorkspace'
import UserContextProvider from './context/userContext';
import TripsContextProvider from './context/TripsContext';


function App() {

  let paths = createBrowserRouter([
    {path:'', element:<Layout/>, children:[
      {index:true, element: <Home/>},
      {path:'destinations', element: <ProtectedRoutes> <Destinations/> </ProtectedRoutes>},
      {path:'tripPlanner', element:<ProtectedRoutes> <TripPlanner/> </ProtectedRoutes>},
      {path:'flights', element:<ProtectedRoutes> <Flights/> </ProtectedRoutes>},
      {path:'trips', element:<ProtectedRoutes> <Trips/> </ProtectedRoutes>},
      {path:'dashboard', element:<ProtectedRoutes> <Dashboard/> </ProtectedRoutes>},
      {path:'profile', element:<ProtectedRoutes> <Profile/> </ProtectedRoutes>},
      {path:'savedflights', element: <ProtectedRoutes> <SavedFlights/> </ProtectedRoutes>},
      {path:'pastTrips', element: <ProtectedRoutes> <PastTrips/> </ProtectedRoutes>},
      {path:'tripsWorkspace', element: <ProtectedRoutes> <TripsWorkspace/> </ProtectedRoutes>},
      {path:'planner', element: <ProtectedRoutes> <PlannerWorkspace/> </ProtectedRoutes>},
      {path:'*', element:<NotFound/>},
    ]

    },
          {path:'login', element:<Login/>},
      {path:'register', element:<Register/>}
  ])

  return (
    <UserContextProvider>
      <TripsContextProvider>
        <ToastContainer position="top-right" />
        <RouterProvider router={paths}></RouterProvider>
      </TripsContextProvider>
    </UserContextProvider>
  )
}

export default App
